import axios from 'axios'

export async function get(url: string): Promise<any> {
  const response = await axios.get(url)
  const data = response.data
  return data
}