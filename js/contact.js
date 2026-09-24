/*
 * Autus Robotics — enquiry form handler.
 *
 * Posts the contact form to a pluggable endpoint configured in js/config.js:
 *   - Web3Forms (default)  -> https://api.web3forms.com/submit
 *   - Formspree (option)   -> https://formspree.io/f/<id>
 * When no key/id is configured it falls back to a mailto: draft so an enquiry
 * is never silently lost. Includes client-side validation and a honeypot.
 */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var cfg = (window.AUTUS_CONFIG && window.AUTUS_CONFIG.form) || {};
  var statusEl = document.getElementById('form-status');
  var submitBtn = document.getElementById('contact-submit');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function field(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function setFieldError(name, msg) {
    var el = form.querySelector('[data-error-for="' + name + '"]');
    var input = field(name);
    if (el) el.textContent = msg || '';
    if (input) {
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    }
  }

  function clearErrors() {
    ['name', 'email', 'message', 'consent'].forEach(function (n) {
      setFieldError(n, '');
    });
  }

  function showStatus(kind, html) {
    if (!statusEl) return;
    statusEl.className = 'form-status is-' + kind;
    statusEl.innerHTML = html;
  }

  function validate(values) {
    var ok = true;
    if (!values.name) {
      setFieldError('name', 'Please enter your name.');
      ok = false;
    }
    if (!values.email) {
      setFieldError('email', 'Please enter your email.');
      ok = false;
    } else if (!EMAIL_RE.test(values.email)) {
      setFieldError('email', 'Please enter a valid email address.');
      ok = false;
    }
    if (!values.message) {
      setFieldError('message', 'Please tell us a little about your enquiry.');
      ok = false;
    }
    if (!values.consent) {
      setFieldError('consent', 'Please confirm we may use your details to reply.');
      ok = false;
    }
    return ok;
  }

  function readValues() {
    return {
      name: (field('name') && field('name').value.trim()) || '',
      company: (field('company') && field('company').value.trim()) || '',
      email: (field('email') && field('email').value.trim()) || '',
      phone: (field('phone') && field('phone').value.trim()) || '',
      message: (field('message') && field('message').value.trim()) || '',
      consent: !!(field('consent') && field('consent').checked),
      honeypot: (field('botcheck') && field('botcheck').value) || ''
    };
  }

  function providerConfigured() {
    if (cfg.provider === 'formspree') return !!cfg.formspreeFormId;
    // default: web3forms
    return !!cfg.web3formsAccessKey;
  }

  function buildMailto(v) {
    var to = cfg.contactEmail || 'info@autusrobotics.com';
    var subject = cfg.subject || 'New enquiry from autusrobotics.com';
    var lines = [
      'Name: ' + v.name,
      v.company ? 'Company: ' + v.company : null,
      'Email: ' + v.email,
      v.phone ? 'Phone: ' + v.phone : null,
      '',
      v.message
    ].filter(function (l) { return l !== null; });
    return 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function payloadFor(v) {
    if (cfg.provider === 'formspree') {
      return {
        url: 'https://formspree.io/f/' + cfg.formspreeFormId,
        body: {
          name: v.name,
          company: v.company,
          email: v.email,
          phone: v.phone,
          message: v.message,
          _subject: cfg.subject || 'New enquiry from autusrobotics.com'
        }
      };
    }
    // Web3Forms
    return {
      url: 'https://api.web3forms.com/submit',
      body: {
        access_key: cfg.web3formsAccessKey,
        subject: cfg.subject || 'New enquiry from autusrobotics.com',
        from_name: 'Autus Robotics website',
        name: v.name,
        company: v.company,
        email: v.email,
        phone: v.phone,
        message: v.message,
        botcheck: ''
      }
    };
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (loading) {
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
    } else if (submitBtn.dataset.label) {
      submitBtn.textContent = submitBtn.dataset.label;
    }
  }

  function onSuccess() {
    form.reset();
    showStatus(
      'success',
      '<strong>Thank you — your message is on its way.</strong> ' +
      'We’ll get back to you shortly at the email you provided.'
    );
  }

  function onError(v) {
    showStatus(
      'error',
      'Sorry, something went wrong sending your message. ' +
      'Please email us directly at <a href="' + buildMailto(v) + '">' +
      (cfg.contactEmail || 'info@autusrobotics.com') + '</a>.'
    );
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    showStatus('', '');

    var v = readValues();

    // Honeypot: a real user never fills this hidden field. Pretend success.
    if (v.honeypot) {
      onSuccess();
      return;
    }

    if (!validate(v)) {
      showStatus('error', 'Please fix the highlighted fields and try again.');
      return;
    }

    // No provider key configured yet: fall back to the visitor's email client.
    if (!providerConfigured()) {
      window.location.href = buildMailto(v);
      showStatus(
        'info',
        'Opening your email app with a pre-filled message to ' +
        (cfg.contactEmail || 'info@autusrobotics.com') +
        '. If nothing happens, please email us there directly.'
      );
      return;
    }

    var p = payloadFor(v);
    setLoading(true);

    fetch(p.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(p.body)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        }).catch(function () {
          return { ok: res.ok, data: {} };
        });
      })
      .then(function (result) {
        // Web3Forms returns { success: true }; Formspree returns 200 + { ok: true }.
        var success = result.ok && (result.data.success !== false);
        if (success) {
          onSuccess();
        } else {
          onError(v);
        }
      })
      .catch(function () {
        onError(v);
      })
      .then(function () {
        setLoading(false);
      });
  });
})();
