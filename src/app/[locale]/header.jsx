const { default: Image } = require("next/image")
const { default: LanguageSelect } = require("./LanguageSelect")

const Header = () => {
    return (
        <div className=" bg-[#1a1a47]">
            <header className="relative z-20 flex items-center justify-between max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-center w-full gap-4">
                    <Image
                        src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/img/footer-logo.webp"
                        width={200}
                        height={72}
                        alt="GTCFX"
                        className="lg:w-[110px] lg:h-[40px] md:w-[110px] md:h-[40px] w-[130px] h-[47px] cursor-pointer"
                    />
                </div>
            </header>
        </div>
    )
}

export default Header