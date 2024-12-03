import { version } from '../package.json'

export const useVersion = () => {
  const getVersion = () => {
    console.log(`App Version: ${version}`)
    return version
  }

  return {
    getVersion,
    version
  }
}
