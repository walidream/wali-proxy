import useMedia from './useMedia'

const usePageSize = () => {
  const xlarge = useMedia('(min-width: 1280px) and (max-width: 1440px)')
  const large = useMedia('(min-width: 1024px) and (max-width: 1279px)')
  const medium = useMedia('(min-width: 768px) and (max-width: 1023px)')
  const small = useMedia('(max-width: 767px)')

  return {
    xlarge,
    large,
    medium,
    small,
  }
}

export default usePageSize
