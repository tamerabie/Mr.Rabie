import type { Unit, VideoTopic } from "./types"

/**
 * Egyptian Curriculum — Primary 1, 1st Term.
 * Scalable data structure: add units to this array and the whole
 * progress map, phonics lab, and exercises update automatically.
 */
export const EGYPTIAN_UNITS: Unit[] = [
  {
    id: "unit-1",
    order: 1,
    title: "Hello!",
    subtitle: "Greetings & the letters A a",
    color: "sky",
    objectives: [
      "Say hello and goodbye",
      "Recognise the letter A / a",
      "Name three classroom words",
    ],
    activities: [
      { id: "u1-a1", title: "Wave & Say Hi", description: "Practise greeting Leo out loud." },
      { id: "u1-a2", title: "Letter Hunt", description: "Find the letter A around the picture." },
    ],
    phonics: [
      { id: "u1-p1", grapheme: "A", word: "Apple", ipaHint: "ah" },
      { id: "u1-p2", grapheme: "a", word: "Ant", ipaHint: "ah" },
      { id: "u1-p3", grapheme: "Hi", word: "Hi", ipaHint: "hai" },
    ],
    exercises: [
      { id: "u1-e1", prompt: "Which word starts with A?", options: ["Ant", "Dog", "Sun"], answerIndex: 0 },
      { id: "u1-e2", prompt: "How do we greet a friend?", options: ["Bye", "Hi", "No"], answerIndex: 1 },
    ],
    test: {
      id: "u1-test",
      title: "Unit 1 Test",
      questions: [
        { id: "u1-t1", prompt: "Pick the letter A.", options: ["A", "B", "C"], answerIndex: 0 },
        { id: "u1-t2", prompt: "Apple starts with…", options: ["A", "S", "T"], answerIndex: 0 },
      ],
    },
  },
  {
    id: "unit-2",
    order: 2,
    title: "My Family",
    subtitle: "Family words & letters B b",
    color: "teal",
    objectives: [
      "Name family members",
      "Recognise the letter B / b",
      "Say 'This is my…'",
    ],
    activities: [
      { id: "u2-a1", title: "Family Photo", description: "Point and name each family member." },
      { id: "u2-a2", title: "B is for Ball", description: "Bounce with the letter B." },
    ],
    phonics: [
      { id: "u2-p1", grapheme: "B", word: "Ball", ipaHint: "buh" },
      { id: "u2-p2", grapheme: "b", word: "Baby", ipaHint: "buh" },
      { id: "u2-p3", grapheme: "Mum", word: "Mum", ipaHint: "muhm" },
    ],
    exercises: [
      { id: "u2-e1", prompt: "Which one is family?", options: ["Ball", "Dad", "Bus"], answerIndex: 1 },
      { id: "u2-e2", prompt: "Ball starts with…", options: ["B", "D", "M"], answerIndex: 0 },
    ],
    test: {
      id: "u2-test",
      title: "Unit 2 Test",
      questions: [
        { id: "u2-t1", prompt: "Pick the letter B.", options: ["D", "B", "P"], answerIndex: 1 },
        { id: "u2-t2", prompt: "Who is family?", options: ["Mum", "Box", "Bag"], answerIndex: 0 },
      ],
    },
  },
  {
    id: "unit-3",
    order: 3,
    title: "Colours",
    subtitle: "Colours & letters C c",
    color: "yellow",
    objectives: [
      "Name four colours",
      "Recognise the letter C / c",
      "Say 'It is red/blue'",
    ],
    activities: [
      { id: "u3-a1", title: "Rainbow Time", description: "Match colours to objects." },
      { id: "u3-a2", title: "C is for Cat", description: "Trace the letter C." },
    ],
    phonics: [
      { id: "u3-p1", grapheme: "C", word: "Cat", ipaHint: "kuh" },
      { id: "u3-p2", grapheme: "c", word: "Cup", ipaHint: "kuh" },
      { id: "u3-p3", grapheme: "Red", word: "Red", ipaHint: "red" },
    ],
    exercises: [
      { id: "u3-e1", prompt: "Which is a colour?", options: ["Blue", "Cat", "Cup"], answerIndex: 0 },
      { id: "u3-e2", prompt: "Cat starts with…", options: ["C", "A", "T"], answerIndex: 0 },
    ],
    test: {
      id: "u3-test",
      title: "Unit 3 Test",
      questions: [
        { id: "u3-t1", prompt: "Pick the letter C.", options: ["G", "C", "O"], answerIndex: 1 },
        { id: "u3-t2", prompt: "Which is red?", options: ["Colour", "Number", "Shape"], answerIndex: 0 },
      ],
    },
  },
  {
    id: "unit-4",
    order: 4,
    title: "Numbers 1-5",
    subtitle: "Counting & letters D d",
    color: "sky",
    objectives: [
      "Count from 1 to 5",
      "Recognise the letter D / d",
      "Say 'I have two…'",
    ],
    activities: [
      { id: "u4-a1", title: "Count with Leo", description: "Count the stars out loud." },
      { id: "u4-a2", title: "D is for Dog", description: "Feed the dog D words." },
    ],
    phonics: [
      { id: "u4-p1", grapheme: "D", word: "Dog", ipaHint: "duh" },
      { id: "u4-p2", grapheme: "d", word: "Duck", ipaHint: "duh" },
      { id: "u4-p3", grapheme: "Three", word: "Three", ipaHint: "three" },
    ],
    exercises: [
      { id: "u4-e1", prompt: "How many? ★★", options: ["One", "Two", "Five"], answerIndex: 1 },
      { id: "u4-e2", prompt: "Dog starts with…", options: ["B", "D", "P"], answerIndex: 1 },
    ],
    test: {
      id: "u4-test",
      title: "Unit 4 Test",
      questions: [
        { id: "u4-t1", prompt: "Pick the letter D.", options: ["D", "B", "O"], answerIndex: 0 },
        { id: "u4-t2", prompt: "Count: ★★★", options: ["Two", "Three", "Four"], answerIndex: 1 },
      ],
    },
  },
]

export const VIDEO_TOPICS: VideoTopic[] = [
  {
    id: "topic-alphabet",
    topic: "Alphabet Adventures",
    videos: [
      {
        id: "v-a1",
        title: "The ABC Song",
        duration: "2:14",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "v-a2",
        title: "Letter Sounds A-E",
        duration: "3:02",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
    ],
  },
  {
    id: "topic-animals",
    topic: "Animal Friends",
    videos: [
      {
        id: "v-an1",
        title: "Farm Animals",
        duration: "2:45",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "v-an2",
        title: "Jungle Animals",
        duration: "3:20",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
    ],
  },
  {
    id: "topic-numbers",
    topic: "Number Fun",
    videos: [
      {
        id: "v-n1",
        title: "Count to Ten",
        duration: "2:30",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      },
    ],
  },
  {
    id: "topic-colors",
    topic: "Colours & Shapes",
    videos: [
      {
        id: "v-c1",
        title: "Rainbow Colours",
        duration: "2:58",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      },
    ],
  },
]
