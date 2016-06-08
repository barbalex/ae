export default (username) =>
  new Promise((resolve, reject) =>
    fetch(`${window.location.protocol}//${window.location.hostname}:8000/userroles/${username}`)
      .then(response => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error))
  )
