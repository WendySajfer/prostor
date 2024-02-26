import HeaderMenu from '~/components/layout/header-menu'
import HeaderStickContainer from '~/components/layout/header-stick-container'

export default function StandardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderStickContainer
        className="z-20 min-w-[720px] "
        hiddenClassName="-translate-y-20"
        minScrollHeight={80}
      >
        <header>
          <div className="min-w-[720px] lg:flex lg:justify-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)] ">
            <div className="min-w-[720px] max-w-[1400px] flex-grow">
              <HeaderMenu />
            </div>
          </div>
        </header>
      </HeaderStickContainer>
      <div className="min-w-[720px]">
        <div className="min-w-[720px] max-w-[1400px]">{children}</div>
      </div>
    </>
  )
}
