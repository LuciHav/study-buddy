import NavButton from "./NavButton";

export default function HeroSection() {
  return (
    <section className=" w-full rounded-sm grid grid-cols-5 overflow-hidden">
      <div className="col-span-3">
        <h1 className="text-6xl font-bold">
          Unlock Deeper Learning <br />
          <span className="text-8xl text-red-400">&amp;</span> Greater Wonders
        </h1>
        <p className="mt-10 text-2xl">
          Study Buddy is your go-to online platform for submitting questions and
          getting answers from other users. Find tutors, make private payments
          online, and enhance your learning experience with ease. Join us today
          and take your education to the next level!
        </p>
        <div className="mt-10 space-x-4 ">
          <NavButton to="/about-us" size="lg">
            Learn More
          </NavButton>
          <NavButton to="/tutors" size="lg">
            Find a Tutor
          </NavButton>
        </div>
      </div>
      <img
        className="object-contain col-span-2"
        src="./hero.png"
        alt="Hero Image"
      />
    </section>
  );
}
