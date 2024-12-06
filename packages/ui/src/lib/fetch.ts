const serverUrl = 'http://localhost:3000'

export default async function fetchFromServer(url: `/${string}`) {
  const response = await fetch(`${serverUrl}${url}`)
  return await response.json()
}
