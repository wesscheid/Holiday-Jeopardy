import { GameData } from "./types";

export const FALLBACK_GAME_DATA: GameData = {
  categories: [
    {
      id: 'c1',
      title: 'Christmas Carols',
      questions: [
        { id: 'q1-200', value: 200, clue: 'This red-nosed reindeer had a very shiny nose.', answer: 'Who is Rudolph?', isAnswered: false },
        { id: 'q1-400', value: 400, clue: 'In "Jingle Bells", this is what it is fun to ride in.', answer: 'What is a one-horse open sleigh?', isAnswered: false },
        { id: 'q1-600', value: 600, clue: 'This carol demands "figgy pudding" right now.', answer: 'What is We Wish You a Merry Christmas?', isAnswered: false },
        { id: 'q1-800', value: 800, clue: 'According to the song, "Good King Wenceslas" looked out on the feast of this saint.', answer: 'Who is Stephen?', isAnswered: false },
        { id: 'q1-1000', value: 1000, clue: 'This best-selling Christmas single of all time was sung by Bing Crosby.', answer: 'What is White Christmas?', isAnswered: false },
      ]
    },
    {
      id: 'c2',
      title: 'Holiday Movies',
      questions: [
        { id: 'q2-200', value: 200, clue: 'This character hates Christmas and lives on Mount Crumpit.', answer: 'Who is The Grinch?', isAnswered: false },
        { id: 'q2-400', value: 400, clue: 'In "Home Alone", Kevin McCallister is left behind when his family goes to this city.', answer: 'What is Paris?', isAnswered: false },
        { id: 'q2-600', value: 600, clue: 'This 2003 film stars Will Ferrell as a human raised by Santa\'s elves.', answer: 'What is Elf?', isAnswered: false },
        { id: 'q2-800', value: 800, clue: 'In "It\'s a Wonderful Life", every time a bell rings, this happens.', answer: 'What is an angel gets his wings?', isAnswered: false },
        { id: 'q2-1000', value: 1000, clue: 'Bruce Willis saves the Nakatomi Plaza party in this action-packed holiday favorite.', answer: 'What is Die Hard?', isAnswered: false },
      ]
    },
    {
      id: 'c3',
      title: 'Winter Wonderland',
      questions: [
        { id: 'q3-200', value: 200, clue: 'No two of these ice crystals are exactly alike.', answer: 'What are snowflakes?', isAnswered: false },
        { id: 'q3-400', value: 400, clue: 'This vegetable is commonly used for a snowman\'s nose.', answer: 'What is a carrot?', isAnswered: false },
        { id: 'q3-600', value: 600, clue: 'The winter solstice occurs in this month in the Northern Hemisphere.', answer: 'What is December?', isAnswered: false },
        { id: 'q3-800', value: 800, clue: 'A blizzard is defined by large amounts of snow and winds of at least this many miles per hour.', answer: 'What is 35?', isAnswered: false },
        { id: 'q3-1000', value: 1000, clue: 'This country gives a Christmas tree to London every year to stand in Trafalgar Square.', answer: 'What is Norway?', isAnswered: false },
      ]
    },
    {
      id: 'c4',
      title: 'Santa\'s Workshop',
      questions: [
        { id: 'q4-200', value: 200, clue: 'Santa Claus is also known as Saint this.', answer: 'Who is Saint Nicholas?', isAnswered: false },
        { id: 'q4-400', value: 400, clue: 'These pointed-ear helpers make the toys.', answer: 'Who are elves?', isAnswered: false },
        { id: 'q4-600', value: 600, clue: 'This is the postal code assigned to Santa Claus in Canada.', answer: 'What is H0H 0H0?', isAnswered: false },
        { id: 'q4-800', value: 800, clue: 'Santa\'s sleigh is pulled by this number of reindeer (including Rudolph).', answer: 'What is 9?', isAnswered: false },
        { id: 'q4-1000', value: 1000, clue: 'In the poem "A Visit from St. Nicholas", Santa is described as smoking one of these.', answer: 'What is a pipe?', isAnswered: false },
      ]
    },
    {
      id: 'c5',
      title: 'Festive Food',
      questions: [
        { id: 'q5-200', value: 200, clue: 'This striped candy is shaped like a shepherd\'s crook.', answer: 'What is a candy cane?', isAnswered: false },
        { id: 'q5-400', value: 400, clue: 'This drink is made with milk, sugar, eggs, and spices.', answer: 'What is eggnog?', isAnswered: false },
        { id: 'q5-600', value: 600, clue: 'These cookies are often built into small houses.', answer: 'What is gingerbread?', isAnswered: false },
        { id: 'q5-800', value: 800, clue: 'This bird is the traditional main course for British Christmas dinners.', answer: 'What is Turkey?', isAnswered: false },
        { id: 'q5-1000', value: 1000, clue: 'In Italy, this sweet bread loaf is a Christmas staple.', answer: 'What is Panettone?', isAnswered: false },
      ]
    }
  ],
  finalJeopardy: {
    category: "Christmas Origins",
    clue: "This Roman festival of Saturn, held in mid-December, is often cited as a precursor to Christmas traditions.",
    answer: "What is Saturnalia?"
  }
};