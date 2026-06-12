// Supabase is loaded via CDN in index.html
// so we use window.supabase directly here

const SUPABASE_URL = 'https://gqrdinzjvjuczxchfzhx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcmRpbnpqdmp1Y3p4Y2hmemh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzYxOTgsImV4cCI6MjA5Njc1MjE5OH0.ynq2KIgIzWJeiAs8MfCim2-Tl5_5PalkumTlK6ZNNOY'

const { createClient } = supabase
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Track which mode we are in
let isLoginMode = true

// Toggle between Login and Signup
document.getElementById('switch-link').addEventListener('click', (e) => {
  e.preventDefault()
  isLoginMode = !isLoginMode

  const usernameGroup = document.getElementById('username-group')
  const confirmGroup = document.getElementById('confirm-password-group')
  const submitBtn = document.getElementById('submit-btn')
  const switchText = document.getElementById('switch-text')
  const forgotLink = document.getElementById('forgot-link')

  if (isLoginMode) {
    usernameGroup.style.display = 'none'
    confirmGroup.style.display = 'none'
    submitBtn.textContent = 'Log In'
    switchText.innerHTML = "Don't have an account? <a href='#' id='switch-link'>Sign up</a>"
    forgotLink.style.display = 'block'
  } else {
    usernameGroup.style.display = 'block'
    confirmGroup.style.display = 'block'
    submitBtn.textContent = 'Sign Up'
    switchText.innerHTML = "Already have an account? <a href='#' id='switch-link'>Log in</a>"
    forgotLink.style.display = 'none'
  }

  // Re-attach toggle listener after innerHTML change
  attachToggle()
})

function attachToggle() {
  const link = document.getElementById('switch-link')
  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      isLoginMode = !isLoginMode

      const usernameGroup = document.getElementById('username-group')
      const confirmGroup = document.getElementById('confirm-password-group')
      const submitBtn = document.getElementById('submit-btn')
      const forgotLink = document.getElementById('forgot-link')

      if (isLoginMode) {
        usernameGroup.style.display = 'none'
        confirmGroup.style.display = 'none'
        submitBtn.textContent = 'Log In'
        forgotLink.style.display = 'block'
      } else {
        usernameGroup.style.display = 'block'
        confirmGroup.style.display = 'block'
        submitBtn.textContent = 'Sign Up'
        forgotLink.style.display = 'none'
      }
    })
  }
}

// Form Submit
document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()
  const errorEl = document.getElementById('error-message')
  errorEl.textContent = ''

  if (isLoginMode) {
    // LOGIN
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) {
      errorEl.textContent = error.message
    } else {
      window.location.href = 'feed.html'
    }

  } else {
    // SIGNUP
    const username = document.getElementById('username').value.trim()
    const confirm = document.getElementById('confirm-password').value.trim()

    if (!username) {
      errorEl.textContent = 'Please enter a username'
      return
    }
    if (password !== confirm) {
      errorEl.textContent = 'Passwords do not match'
      return
    }
    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters'
      return
    }

    const { data, error } = await client.auth.signUp({ email, password })

    if (error) {
      errorEl.textContent = error.message
      return
    }

    if (data.user) {
      await client.from('profiles').insert({
        id: data.user.id,
        username: username,
        full_name: username
      })
      errorEl.style.color = 'green'
      errorEl.textContent = '✅ Account created! Check your email to confirm.'
    }
  }
})