import { useEffect, useState } from "react";
import quotes from "./quotes.json";

type Quote = {
  quote: string;
  movieName: string;
};

const randomQuote = (): Quote =>
  quotes[Math.floor(quotes.length * Math.random())];

export default function TyperacerPage() {
  const [quote, setQuote] = useState<Quote>();

  useEffect(() => {
    setQuote(randomQuote());
  }, []);

  return (
    <div className="px-20">
      <h1 className="mb-4">Typeracer</h1>
      <p className="font-mono">
        <span className="text-black">{quote?.quote}</span>
      </p>
      <input className="w-full border-black border px-4 py-2" />
    </div>
  );
}
