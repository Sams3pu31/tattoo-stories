import blackLogo from '../../../assets/logo/logo-mark-black.png'
import whiteLogo from '../../../assets/logo/logo-mark-white.png'

type LogoMarkProps = {
  className?: string
  tone?: 'auto' | 'black' | 'white'
}

function LogoMark({
  className,
  tone = 'auto',
}: LogoMarkProps) {
  const source = tone === 'white'
    ? whiteLogo
    : blackLogo

  return (
    <img
      className={className}
      src={source}
      alt=""
      aria-hidden="true"
    />
  )
}

export default LogoMark