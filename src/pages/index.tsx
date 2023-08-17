import { Image } from "@mantine/core";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Block from "../../components/Home/Block";
import { useMediaQuery } from '@mantine/hooks';

const Home = () => {
    const isMobile = useMediaQuery(`(max-width: 760px)`);
    
    return (
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 3, 500: 3, 750: 3, 900: 4}}
            >
                <Masonry>
                    
                    <Block img_name='1.png' />
                    <Block img_name='2.png' />
                    <Block img_name='3.png' />
                    <Block img_name='4.png' />
                    <Block img_name='2.png' />
                    <Block img_name='4.png' />
                    <Block img_name='2.png' />
                    <Block img_name='2.png' />
                    <Block img_name='4.png' />
                    <Block img_name='2.png' />
                    <Block img_name='4.png' />
                    <Block img_name='2.png' />
                    <Block img_name='4.png' />
                    <Block img_name='1.png' />

                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}

export default Home;