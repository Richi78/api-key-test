const API_BASE = 'https://unicen-bolsa-virtual-de-trabajo-dep.vercel.app/api/v1'

function showAlert(message, type) {
  const alert = document.getElementById('alert')
  alert.className = `alert alert-${type}`
  alert.textContent = message
}

function showResult(data) {
  const result = document.getElementById('result')
  result.innerHTML = `
    <div class="result-label">Respuesta:</div>
    <pre class="result">${JSON.stringify(data, null, 2)}</pre>
  `
}

function getRedirectURL(token) {
  return `https://unicen-bolsa-virtual-de-trabajo-dep.vercel.app/external-auth?token=${token}`
}

document.getElementById('externalForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const submitBtn = document.getElementById('submitBtn')
  submitBtn.disabled = true
  showAlert('', '')

  const data = {
    // email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    unicode: document.getElementById('unicode').value || null,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    phone: document.getElementById('phone').value,
    campus: document.getElementById('campus').value || undefined,
    countryName: document.getElementById('countryId').value,
    cityName: document.getElementById('cityId').value,
  }

  try {
    const response = await fetch(`${API_BASE}/partners/external-candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': document.getElementById('apiKey').value,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      showAlert('Token recibido correctamente', 'success')
      showResult(result)

      const redirectURL = getRedirectURL(result.token)
      const redirectDiv = document.createElement('div')
      redirectDiv.className = 'redirect-box'
      redirectDiv.innerHTML = `
        <div class="result-label">Redirigir a:</div>
        <a href="${redirectURL}" target="_blank">${redirectURL}</a>
      `
      document.getElementById('result').appendChild(redirectDiv)
    } else {
      showAlert(result.error || 'Error en la solicitud', 'error')
      showResult(result)
    }
  } catch (err) {
    showAlert('Error de conexión: ' + err.message, 'error')
  } finally {
    submitBtn.disabled = false
  }
})