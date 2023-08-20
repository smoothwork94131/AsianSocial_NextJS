import { Image } from "@mantine/core";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Block from "@/components/Home/Block";
import { useMediaQuery } from '@mantine/hooks';

const Home = () => {
    
    return (
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 3, 500: 3, 750: 3, 900: 4}}
            >
                <Masonry>
                    
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}

export default Home;