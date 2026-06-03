import Donut from "./components/Donut";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Donut percentage={75} size="medium" text="Progress" />
    </div>
  );
}
