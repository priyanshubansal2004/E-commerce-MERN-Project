import heroImg from "../../assets/rabbit-hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="Rabbit"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />
      <div className="absolute inset-0 bg-opacity-5 flex items-center justify-center">
        <div className="text-center text-gray-300 p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            Closet <br /> Ready
          </h1>
          <p className="text-sm md:text-lg tracking-tighter mb-6 text-black italic">
            Explore our aesthetic outfits with fast worldwide shipping.
          </p>
          <Link
            to="/collections/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-md text-lg font-semibold hover:bg-gray-200 transition"
            >
            Shop Now
          </Link>

        </div>
      </div>
    </section>
  );
};

export default Hero;
