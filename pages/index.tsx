import { useEffect, useMemo, useState } from "react";
import { GameState } from "./game_state";
import { Quote, randomQuote } from "./repository";
import StatsDisplay from "./stats_display";

const inputId = "typeracer-input";

export default function TyperacerPage() {
  const [quote, setQuote] = useState<Quote>();
  const [text, setText] = useState<string>("");
  const [currentWord, setCurrentWord] = useState<string>();
  const quotesSplit = useMemo(() => quote?.quote.split(" ") ?? [], [quote]);
  const [wordIdx, setWordIdx] = useState<number>(0);
  const alreadyTypedWords = useMemo(
    () => quotesSplit.slice(0, wordIdx).join(" "),
    [quotesSplit, wordIdx]
  );
  const wordsToBeTyped = useMemo(
    () => quotesSplit.slice(wordIdx + 1, quotesSplit.length).join(" "),
    [quotesSplit, wordIdx]
  );
  const correctGreenWord = useMemo(() => {
    if (currentWord) {
      let i = 0;
      while (i < text.length) {
        if (text[i] != currentWord[i]) {
          break;
        }
        i++;
      }
      return text.slice(0, i);
    }
    return "";
  }, [currentWord, text]);
  const [gameState, setGameState] = useState(GameState.WAITING);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const wrongRedWord = useMemo(
    () => currentWord?.slice(correctGreenWord.length, text.length),
    [correctGreenWord, currentWord, text]
  );

  useEffect(() => {
    document.getElementById(inputId)?.focus();
  }, []);

  useEffect(() => {
    setWordIdx(0);
    setText("");
  }, [quotesSplit]);

  useEffect(() => {
    setCurrentWord(quotesSplit[wordIdx]);
  }, [wordIdx, quotesSplit]);

  useEffect(() => {
    const latestLetter = text?.charAt(text.length - 1);
    if (latestLetter != " " && wordIdx != quotesSplit.length - 1) return;
    const textWithoutTrailingSpace = text?.replace(/\s*$/, "");
    if (textWithoutTrailingSpace == currentWord) {
      setText("");
      setWordIdx(() => wordIdx + 1);
    }
  }, [text, currentWord, wordIdx, quotesSplit]);

  useEffect(() => {
    setGameState(GameState.PLAYING);
  }, []);

  useEffect(() => {
    if (gameState == GameState.PLAYING) {
      document.getElementById(inputId)?.focus();
      setQuote(randomQuote());
      setStartTime(Date.now());
    }
    if (gameState == GameState.VIEW_STATS) {
      setEndTime(Date.now());
    }
  }, [gameState]);

  useEffect(() => {
    const quoteFinished =
      quotesSplit.length == wordIdx && quotesSplit.length != 0;
    if (quoteFinished) {
      setGameState(GameState.VIEW_STATS);
    }
  }, [wordIdx, quotesSplit]);

  const nextQuote = () => {
    setGameState(GameState.PLAYING);
  };

  return (
    <div className="px-20 mt-40">
      <h1 className="mb-4">Typeracer</h1>
      <p className="font-mono">
        <span className="text-green-600">{alreadyTypedWords} </span>
        <span className="text-green-600">{correctGreenWord}</span>
        <span className="text-red-700 bg-red-200">{wrongRedWord}</span>
        <span className="underline">{currentWord?.slice(text.length)}</span>
        <span className="text-black"> {wordsToBeTyped}</span>
      </p>
      <input
        className="w-full border-black border px-4 py-2"
        onChange={(text) => setText(text.target.value)}
        value={text}
        disabled={gameState == GameState.VIEW_STATS}
        id={inputId}
      />
      {quote && gameState == GameState.VIEW_STATS && (
        <StatsDisplay
          startTime={startTime}
          endTime={endTime}
          quote={quote}
          numOfWords={quotesSplit.length}
          onClickNextQuote={nextQuote}
        />
      )}
    </div>
  );
}
