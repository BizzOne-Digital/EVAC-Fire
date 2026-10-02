import Image from 'next/image'

export type LogoData = { src: string; width: number; height: number; plate: boolean }

export function Logo({ logo, name }: { logo: LogoData; name: string }) {
  return (
    <span className={logo.plate ? 'brand-plate' : 'brand-mark'}>
      <Image src={logo.src} alt={name} width={logo.width} height={logo.height} sizes="200px" priority />
    </span>
  )
}
