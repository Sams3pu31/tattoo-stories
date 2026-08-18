import blackLogo from '../../../assets/logo/logo-mark-black.png'
import whiteLogo from '../../../assets/logo/logo-mark-white.png'
import { useTheme } from '../../../hooks/useTheme'

type LogoMarkProps = {
  className?: string
  tone?: 'auto' | 'black' | 'white'
}

function LogoMark({
  className,
  tone = 'auto',
}: LogoMarkProps) {
  const { resolvedTheme } = useTheme()

  const source =
    tone === 'white'
      ? whiteLogo
      : tone === 'black'
        ? blackLogo
        : resolvedTheme === 'dark'
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