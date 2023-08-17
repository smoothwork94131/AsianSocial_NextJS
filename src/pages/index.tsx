import { Image } from "@mantine/core";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Block from "../../components/Home/Block";

const Home = () => {
    return (
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 500: 2, 750: 3, 900: 4}}
            >
                <Masonry>
                    {/* <Image src='/1.jpg' alt="block" m={10}/>
                    <Image src='/2.jpeg' alt="block" m={10}/>
                    <Image src='/3.png' alt="block" m={10}/>
                    <Image src='/4.png' alt="block" m={10}/>
                    <Image src='/2.jpeg' alt="block" m={10}/>
                    <Image src='/4.png' alt="block" m={10}/>
                    <Image src='/1.jpg' alt="block" m={10}/>    
                    <Image src='/3.png' alt="block" m={10}/>
                    <Image src='/3.png' alt="block" m={10}/>
                     */}
                    <Block img_name='1.jpg' />
                    <Block img_name='2.jpeg' />
                    <Block img_name='3.png' />
                    <Block img_name='4.png' />
                    <Block img_name='2.jpeg' />
                    <Block img_name='4.png' />
                    <Block img_name='2.jpeg' />
                    <Block img_name='2.jpeg' />
                    <Block img_name='4.png' />
                    <Block img_name='2.jpeg' />
                    <Block img_name='4.png' />
                    <Block img_name='2.jpeg' />
                    <Block img_name='4.png' />
                    <Block img_name='1.jpg' />

                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}

export default Home;