import { Image } from "@mantine/core";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

const Home = () => {
    return (
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                    <Image src='/1.jpg' alt="block" m={10}/>
                    <Image src='/2.jpeg' alt="block" m={10}/>
                    <Image src='/3.png' alt="block" m={10}/>
                    <Image src='/4.png' alt="block" m={10}/>
                    <Image src='/2.jpeg' alt="block" m={10}/>
                    <Image src='/4.png' alt="block" m={10}/>
                    <Image src='/1.jpg' alt="block" m={10}/>    
                    <Image src='/3.png' alt="block" m={10}/>
                    <Image src='/3.png' alt="block" m={10}/>
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}

export default Home;