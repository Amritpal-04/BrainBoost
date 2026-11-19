import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LockKeyhole,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";

const starterLessons = [
  {
    unit: "Getting started",
    title: "Meet your abacus",
    intro: "An abacus is a counting tool. Beads move on rods, and the middle bar helps us read the number.",
    demoValue: 0,
    visualValues: [0, 4, 4],
    steps: [
      "Each upright line is called a rod.",
      "Beads moved to the middle bar are active; beads away from it are resting.",
      "This practice abacus has three rods, so we can learn numbers from 0 to 999.",
    ],
    question: "Which beads do we count?",
    choices: ["Every bead on the frame", "Only beads moved to the middle bar", "Only the beads at the bottom"],
    answer: 1,
    explanation: "Correct! Active beads are the ones moved to the middle bar.",
  },
  {
    unit: "Getting started",
    title: "Find the ones rod",
    intro: "A rod's place tells us what its beads are worth. The rod on the far right is always the ones rod.",
    demoValue: 4,
    visualValues: [1, 10, 11],
    steps: [
      "Look at the right-hand rod: it counts ones.",
      "The next rod to the left counts tens.",
      "So one active bead on the right means 1, and one active bead on the left means 10.",
    ],
    question: "Which rod shows ones?",
    choices: ["The rod on the right", "The rod on the left", "Both rods always show ones"],
    answer: 0,
    explanation: "Right! The right-hand rod is the ones place.",
  },
  {
    unit: "Getting started",
    title: "One lower bead",
    intro: "Lower beads are small steps. On the ones rod, each active lower bead adds one.",
    demoValue: 1,
    visualValues: [0, 1, 1],
    steps: [
      "Start with all beads resting: that shows 0.",
      "Move one lower bead on the ones rod to the bar.",
      "One active lower bead means 1.",
    ],
    question: "One lower bead is worth how many ones?",
    choices: ["1", "5", "10"],
    answer: 0,
    explanation: "Yes! Each lower bead on the ones rod is worth 1.",
  },
  {
    unit: "Getting started",
    title: "Count to four",
    intro: "The four lower beads on a rod help us show the numbers 1, 2, 3, and 4.",
    demoValue: 4,
    visualValues: [1, 3, 4],
    steps: [
      "Move one lower bead to show 1.",
      "Move a second, third, and fourth bead to show 2, 3, and 4.",
      "Say the number as you count each bead touching the bar.",
    ],
    question: "How many active lower beads show 3?",
    choices: ["1", "3", "4"],
    answer: 1,
    explanation: "You got it: three active lower beads show 3.",
  },
  {
    unit: "Getting started",
    title: "Meet the five bead",
    intro: "The single upper bead is a shortcut. On the ones rod, it is worth five.",
    demoValue: 5,
    visualValues: [0, 5, 5],
    steps: [
      "The upper bead starts away from the bar.",
      "Move it down to the bar to count it.",
      "One active upper bead on the ones rod shows 5.",
    ],
    question: "What number does one active upper bead show on the ones rod?",
    choices: ["1", "4", "5"],
    answer: 2,
    explanation: "Correct! The upper bead is worth five ones.",
  },
  {
    unit: "Numbers",
    title: "Build six",
    intro: "Numbers from 6 to 9 use the five bead and some lower beads together.",
    demoValue: 6,
    visualValues: [0, 5, 6],
    steps: [
      "Move the upper bead to the bar: that makes 5.",
      "Move one lower bead to the bar: that adds 1.",
      "Five plus one makes 6.",
    ],
    question: "How do you show 6 on the ones rod?",
    choices: ["One upper bead and one lower bead", "One lower bead only", "Two upper beads"],
    answer: 0,
    explanation: "Exactly! Five from the upper bead plus one lower bead is 6.",
  },
  {
    unit: "Numbers",
    title: "Build seven, eight, and nine",
    intro: "Keep the five bead active and add more lower beads to make the next numbers.",
    demoValue: 9,
    visualValues: [7, 8, 9],
    steps: [
      "For 7, use the upper bead and two lower beads: 5 + 2.",
      "For 8, use the upper bead and three lower beads: 5 + 3.",
      "For 9, use the upper bead and all four lower beads: 5 + 4.",
    ],
    question: "What beads show 9?",
    choices: ["Upper bead and four lower beads", "Upper bead and one lower bead", "Four upper beads"],
    answer: 0,
    explanation: "Right! Five and four more make 9.",
  },
  {
    unit: "Numbers",
    title: "Zero means none",
    intro: "Zero is important too. It means no beads are active on that rod.",
    demoValue: 0,
    visualValues: [5, 0, 0],
    steps: [
      "Move the upper bead away from the bar.",
      "Move all four lower beads away from the bar.",
      "With no active beads, the rod shows zero.",
    ],
    question: "What does a ones rod with no active beads show?",
    choices: ["0", "1", "5"],
    answer: 0,
    explanation: "Yes! No active beads on a rod means zero in that place.",
  },
  {
    unit: "Numbers",
    title: "Make a ten",
    intro: "When ten ones are collected, we exchange them for one ten on the rod to the left.",
    demoValue: 10,
    visualValues: [9, 10, 10],
    steps: [
      "Start with 9 ones on the right-hand rod.",
      "Add one more to make 10 ones, then exchange them for one ten.",
      "That is how the abacus shows 10: one ten and zero ones.",
    ],
    question: "How is 10 shown on our two-rod abacus?",
    choices: ["One ten and zero ones", "Ten beads on the ones rod", "One one and zero tens"],
    answer: 0,
    explanation: "Correct! The tens rod shows 1, and the ones rod shows 0.",
  },
  {
    unit: "Numbers",
    title: "Read a two-digit number",
    intro: "Read each rod separately, then put the place values together.",
    demoValue: 24,
    visualValues: [20, 24, 24],
    steps: [
      "Read the tens rod first: two active tens means 20.",
      "Read the ones rod: four active ones means 4.",
      "Put them together: 20 + 4 = 24.",
    ],
    question: "Two tens and four ones make which number?",
    choices: ["42", "24", "6"],
    answer: 1,
    explanation: "That's it! Two tens and four ones make 24.",
  },
  {
    unit: "Addition",
    title: "Add by counting on",
    intro: "To add a small number, start with the first number and count forward.",
    demoValue: 5,
    visualValues: [2, 5, 5],
    steps: [
      "Show 2 on the ones rod.",
      "Add 3 more by counting: 3, 4, 5.",
      "The answer is 5.",
    ],
    question: "What is 2 + 3?",
    choices: ["4", "5", "6"],
    answer: 1,
    explanation: "Great! Start at 2 and count three more to get 5.",
  },
  {
    unit: "Addition",
    title: "Add with the five bead",
    intro: "The upper bead makes adding around five easier to see.",
    demoValue: 7,
    visualValues: [5, 6, 7],
    steps: [
      "Start at 5 with the upper bead active.",
      "Add two lower beads.",
      "Five plus two makes 7.",
    ],
    question: "What is 5 + 2?",
    choices: ["6", "7", "8"],
    answer: 1,
    explanation: "Correct! Two more than five is seven.",
  },
  {
    unit: "Addition",
    title: "Add past five",
    intro: "If an addition goes past five, use the upper bead and keep counting with lower beads.",
    demoValue: 7,
    visualValues: [4, 5, 7],
    steps: [
      "Start with 4 lower beads active.",
      "To make 5, move those four lower beads away and move the upper bead to the bar.",
      "Add two lower beads to make 7, so 4 + 3 = 7.",
    ],
    question: "What is 4 + 3?",
    choices: ["6", "7", "8"],
    answer: 1,
    explanation: "Yes! 4 + 1 makes 5, then 2 more makes 7.",
  },
  {
    unit: "Addition",
    title: "Make ten to add",
    intro: "When there are not enough lower beads left, make a ten and carry the extra ones.",
    demoValue: 13,
    visualValues: [8, 10, 13],
    steps: [
      "Start with 8 and add 5.",
      "Add 2 to 8 to make 10. There are 3 of the 5 still to add.",
      "Exchange 10 ones for one ten, then add 3 ones: the answer is 13.",
    ],
    question: "What is 8 + 5?",
    choices: ["12", "13", "14"],
    answer: 1,
    explanation: "That's right! 8 + 2 makes 10, and 3 more makes 13.",
  },
  {
    unit: "Addition",
    title: "Add tens",
    intro: "Tens can be added just like ones. Each lower bead on the tens rod is worth ten.",
    demoValue: 50,
    visualValues: [20, 50, 50],
    steps: [
      "Show 20 with two lower beads on the tens rod.",
      "Add 30 by moving three more tens.",
      "Two tens plus three tens is five tens, or 50.",
    ],
    question: "What is 20 + 30?",
    choices: ["40", "50", "60"],
    answer: 1,
    explanation: "Correct! 2 tens plus 3 tens make 5 tens, which is 50.",
  },
  {
    unit: "Addition",
    title: "Add without a carry",
    intro: "When the ones still fit on their rod, add them there and leave the tens alone.",
    demoValue: 27,
    visualValues: [23, 27, 27],
    steps: [
      "Start with 23: two tens and three ones.",
      "Add 4 ones to the three ones.",
      "Seven ones and two tens make 27.",
    ],
    question: "What is 23 + 4?",
    choices: ["26", "27", "34"],
    answer: 1,
    explanation: "Well done! 3 ones plus 4 ones is 7 ones, so the total is 27.",
  },
  {
    unit: "Addition",
    title: "Add and carry a ten",
    intro: "When the ones total ten or more, trade ten ones for one ten.",
    demoValue: 32,
    visualValues: [27, 30, 32],
    steps: [
      "Start with 27 and add 5 ones.",
      "Seven ones plus five ones makes 12 ones: trade ten for one ten.",
      "Now there are three tens and two ones, which is 32.",
    ],
    question: "What is 27 + 5?",
    choices: ["31", "32", "33"],
    answer: 1,
    explanation: "Exactly! 27 + 3 makes 30, then 2 more makes 32.",
  },
  {
    unit: "Subtraction",
    title: "Subtract by counting back",
    intro: "Subtraction takes away. Move beads away from the bar, or count backward to find what remains.",
    demoValue: 5,
    visualValues: [8, 5, 5],
    steps: [
      "Start with 8 active ones.",
      "Take away 3 by moving three ones away from the bar.",
      "Five ones remain, so 8 − 3 = 5.",
    ],
    question: "What is 8 − 3?",
    choices: ["4", "5", "6"],
    answer: 1,
    explanation: "Yes! Taking three away from eight leaves five.",
  },
  {
    unit: "Subtraction",
    title: "Subtract across ten",
    intro: "If there are not enough ones to take away, exchange one ten for ten ones first.",
    demoValue: 8,
    visualValues: [13, 13, 8],
    steps: [
      "Start with 13: one ten and three ones.",
      "To take away 5 ones, exchange the ten for ten ones. Now there are 13 ones.",
      "Take away 5. Eight ones remain, so 13 − 5 = 8.",
    ],
    question: "What is 13 − 5?",
    choices: ["7", "8", "9"],
    answer: 1,
    explanation: "Correct! Exchange the ten, then 13 take away 5 leaves 8.",
  },
  {
    unit: "Subtraction",
    title: "Subtract tens and ones",
    intro: "For a two-digit subtraction, work with the tens and ones places.",
    demoValue: 22,
    visualValues: [34, 24, 22],
    steps: [
      "Start with 34: three tens and four ones.",
      "Take away 1 ten and 2 ones.",
      "Two tens and two ones remain, so 34 − 12 = 22.",
    ],
    question: "What is 34 − 12?",
    choices: ["20", "22", "24"],
    answer: 1,
    explanation: "You did it! 3 tens − 1 ten is 2 tens, and 4 − 2 is 2 ones.",
  },
];

function makeLesson(unit, title, intro, visualValues, steps, question, choices, answer, explanation) {
  return {
    unit,
    title,
    intro,
    demoValue: visualValues[visualValues.length - 1],
    visualValues,
    steps,
    question,
    choices,
    answer,
    explanation,
  };
}

const placeValueLessons = [
  makeLesson(
    "Place value",
    "Meet the hundreds rod",
    "A third rod lets us show hundreds. Each rod is ten times the value of the rod to its right.",
    [0, 100, 100],
    ["The right rod counts ones and the middle rod counts tens.", "The left rod is the hundreds rod.", "One lower bead on the hundreds rod is worth 100."],
    "One lower bead on the hundreds rod is worth how much?",
    ["1", "10", "100"],
    2,
    "Exactly! One bead in the hundreds place is worth 100.",
  ),
  makeLesson(
    "Place value",
    "Show one hundred",
    "A number can have one hundred, no tens, and no ones. The empty rods still matter.",
    [0, 100, 100],
    ["Start with every bead resting: that is 0.", "Move one lower bead on the hundreds rod to the bar.", "Leave the tens and ones rods clear: the number is 100."],
    "How many tens are in 100?",
    ["0", "1", "10"],
    0,
    "Right! 100 has one hundred, zero tens, and zero ones.",
  ),
  makeLesson(
    "Place value",
    "Build a three-digit number",
    "Read hundreds, tens, and ones from left to right, then join the digits.",
    [200, 240, 246],
    ["Show 2 hundreds: that is 200.", "Add 4 tens: now the number is 240.", "Add 6 ones to make 246."],
    "Two hundreds, four tens, and six ones make which number?",
    ["264", "246", "426"],
    1,
    "Great reading: 200 + 40 + 6 = 246.",
  ),
  makeLesson(
    "Place value",
    "Zero keeps a place",
    "A zero digit holds its place so the other digits keep their correct value.",
    [400, 400, 406],
    ["Four hundreds make 400.", "There are no tens, so the tens digit is 0.", "Add 6 ones: the number is 406, not 46."],
    "What does 406 have in the tens place?",
    ["0 tens", "4 tens", "6 tens"],
    0,
    "Yes! The zero is a placeholder for the empty tens place.",
  ),
  makeLesson(
    "Place value",
    "Expanded form",
    "Expanded form tells how much each digit is worth instead of only naming the digits.",
    [500, 520, 528],
    ["In 528, the 5 is worth 500.", "The 2 is worth 20.", "The 8 is worth 8, so 528 = 500 + 20 + 8."],
    "Which is the expanded form of 528?",
    ["500 + 20 + 8", "50 + 20 + 8", "500 + 2 + 8"],
    0,
    "Correct! Each digit contributes its place value.",
  ),
  makeLesson(
    "Place value",
    "Compare hundreds first",
    "To compare three-digit numbers, check the hundreds place first. The bigger hundreds digit wins.",
    [219, 219, 291],
    ["Look at 219 and 291.", "Both have 2 hundreds, so compare the tens.", "9 tens is more than 1 ten: 291 is greater."],
    "Which number is greater: 219 or 291?",
    ["219", "291", "They are equal"],
    1,
    "Right! The hundreds match, so the tens decide.",
  ),
  makeLesson(
    "Place value",
    "Compare tens next",
    "When the hundreds match, compare the tens. If those match too, compare the ones.",
    [352, 372, 375],
    ["Both 352 and 375 have 3 hundreds.", "Compare the tens: 5 tens is less than 7 tens.", "So 375 is greater, even before checking the ones."],
    "Which number is greater: 352 or 375?",
    ["352", "375", "They are equal"],
    1,
    "Exactly! Seven tens is more than five tens.",
  ),
  makeLesson(
    "Place value",
    "Count forward by tens",
    "Adding one ten changes the tens rod by one bead while the ones stay the same.",
    [340, 350, 370],
    ["Start at 340.", "Add one ten to reach 350.", "Add two more tens to reach 370."],
    "What is 340 + 30?",
    ["343", "370", "640"],
    1,
    "Correct! Three more tens make 370.",
  ),
  makeLesson(
    "Place value",
    "Count by hundreds",
    "Adding hundreds changes the hundreds rod. The tens and ones can stay just as they are.",
    [125, 225, 425],
    ["Start with 125.", "Add one hundred: 225.", "Add two more hundreds: 425."],
    "What is 125 + 300?",
    ["155", "325", "425"],
    2,
    "Well done! 125 plus three hundreds is 425.",
  ),
  makeLesson(
    "Place value",
    "Build a number from clues",
    "Use each place-value clue to build a number one rod at a time.",
    [300, 320, 324],
    ["Three hundreds make 300.", "Two tens make 320.", "Four ones make 324."],
    "What number has 3 hundreds, 2 tens, and 4 ones?",
    ["342", "324", "234"],
    1,
    "You got it: 300 + 20 + 4 = 324.",
  ),
];

const extraAdditionLessons = [
  makeLesson(
    "Addition",
    "Add a few ones",
    "When the ones fit on their rod, add them there and keep the other rods unchanged.",
    [43, 45, 48],
    ["Start at 43: four tens and three ones.", "Add 2 ones to reach 45.", "Add 3 more ones to reach 48."],
    "What is 43 + 5?",
    ["48", "53", "45"],
    0,
    "Correct! Three ones plus five more ones makes eight ones.",
  ),
  makeLesson(
    "Addition",
    "Carry into the hundreds",
    "Sometimes adding a ten changes the hundreds digit. Watch the tens rod reach ten and trade.",
    [295, 300, 305],
    ["Start at 295: two hundreds, nine tens, and five ones.", "Add 5 ones to make 300: ten tens trade for one hundred.", "Add 5 more ones to finish at 305."],
    "What is 295 + 10?",
    ["296", "305", "395"],
    1,
    "Yes! 295 plus five makes 300, then five more makes 305.",
  ),
  makeLesson(
    "Addition",
    "Add three numbers",
    "Add in friendly parts: combine two numbers first, then add the last one.",
    [24, 39, 45],
    ["Start with 24.", "Add 15 to reach 39.", "Add 6 more: the total is 45."],
    "What is 24 + 15 + 6?",
    ["39", "45", "51"],
    1,
    "Great work! 24 + 15 = 39, and 39 + 6 = 45.",
  ),
];

const extraSubtractionLessons = [
  makeLesson(
    "Subtraction",
    "Borrow one ten",
    "If there are not enough ones to take away, trade one ten for ten ones.",
    [52, 50, 45],
    ["Start with 52: five tens and two ones.", "Trade one ten for ten ones so you can take away 7.", "Take away 7 ones: 45 remains."],
    "What is 52 − 7?",
    ["44", "45", "55"],
    1,
    "Correct! 52 − 2 reaches 50, then 5 more back reaches 45.",
  ),
  makeLesson(
    "Subtraction",
    "Exchange a hundred",
    "A hundred can be traded for ten tens, which can help when a place does not have enough beads.",
    [402, 400, 376],
    ["Start with 402: four hundreds, zero tens, and two ones.", "Take away 2 ones to reach 400.", "Take away 24 more by exchanging a hundred: 376 remains."],
    "What is 402 − 26?",
    ["376", "386", "426"],
    0,
    "Exactly! Exchange across the empty tens place, then subtract the rest.",
  ),
  makeLesson(
    "Subtraction",
    "Subtract two-digit numbers",
    "Break the number you take away into tens and ones to make the steps easier.",
    [74, 44, 36],
    ["Start at 74.", "Take away 3 tens to reach 44.", "Take away 8 ones to reach 36."],
    "What is 74 − 38?",
    ["36", "46", "42"],
    0,
    "Well done! 74 − 30 = 44, then 44 − 8 = 36.",
  ),
  makeLesson(
    "Subtraction",
    "Subtract three-digit numbers",
    "Subtract hundreds, tens, and ones in friendly chunks.",
    [562, 362, 331],
    ["Start at 562.", "Take away 2 hundreds to reach 362.", "Take away 31 more: 331 remains."],
    "What is 562 − 231?",
    ["321", "331", "341"],
    1,
    "Correct! 562 − 200 = 362, and 362 − 31 = 331.",
  ),
  makeLesson(
    "Subtraction",
    "Subtract across a zero",
    "An empty place does not stop us. Exchange from the next place to make the beads we need.",
    [503, 303, 303],
    ["Start at 503: five hundreds, zero tens, and three ones.", "Take away 2 hundreds to reach 303.", "Three hundreds and three ones remain, so 503 − 200 = 303."],
    "What is 503 − 200?",
    ["303", "403", "300"],
    0,
    "Yes! Taking away two hundreds leaves three hundreds and three ones.",
  ),
  makeLesson(
    "Subtraction",
    "Solve a story problem",
    "Turn the story into a subtraction sentence, then work it out in parts.",
    [300, 200, 172],
    ["A library has 300 books and lends out 128.", "Take away 100 books: 200 remain.", "Take away 28 more: 172 books remain."],
    "What is 300 − 128?",
    ["172", "182", "228"],
    0,
    "That's right! 300 − 100 = 200, and 200 − 28 = 172.",
  ),
  makeLesson(
    "Subtraction",
    "Estimate before subtracting",
    "Rounding can help you predict a reasonable answer before doing the exact subtraction.",
    [398, 200, 197],
    ["Estimate 398 as about 400 and 201 as about 200.", "About 400 − 200 is about 200.", "The exact answer is 197, which is close to our estimate."],
    "What is 398 − 201?",
    ["197", "299", "207"],
    0,
    "Great estimate and exact answer! 197 is close to 200.",
  ),
];

const multiplicationLessons = [
  makeLesson(
    "Multiplication & division",
    "Multiplication means equal groups",
    "Multiplication is a quick way to add the same amount again and again.",
    [4, 8, 12],
    ["Make the first group of 4.", "Add a second group of 4: 8.", "Add a third group of 4: 12."],
    "What is 3 groups of 4?",
    ["7", "12", "16"],
    1,
    "Correct! 4 + 4 + 4 = 12, so 3 × 4 = 12.",
  ),
  makeLesson(
    "Multiplication & division",
    "Multiply tens",
    "Multiply the number first, then keep the tens place in the answer.",
    [20, 40, 80],
    ["One group of 20 is 20.", "Two groups of 20 make 40.", "Four groups of 20 make 80."],
    "What is 4 × 20?",
    ["24", "80", "800"],
    1,
    "Yes! 4 × 2 tens is 8 tens, or 80.",
  ),
  makeLesson(
    "Multiplication & division",
    "Multiply a two-digit number",
    "Build equal groups by adding the same number each time.",
    [23, 46, 69],
    ["One group of 23 is 23.", "Two groups make 23 + 23 = 46.", "Three groups make 46 + 23 = 69."],
    "What is 3 × 23?",
    ["59", "69", "79"],
    1,
    "Exactly! Three groups of 23 make 69.",
  ),
  makeLesson(
    "Multiplication & division",
    "Use a small array",
    "An array is a tidy set of equal rows and columns. Count each row to find the total.",
    [6, 12, 24],
    ["One row of 6 has 6 dots.", "Two rows have 12 dots.", "Four rows have 24 dots."],
    "How many dots are in 4 rows of 6?",
    ["10", "24", "46"],
    1,
    "Right! Four rows of six make 24.",
  ),
  makeLesson(
    "Multiplication & division",
    "Double to multiply by four",
    "Doubling means adding a number to itself. Double twice to multiply by four.",
    [7, 14, 28],
    ["Start with 7.", "Double 7 to get 14.", "Double 14 to get 28."],
    "What is 4 × 7?",
    ["21", "28", "32"],
    1,
    "Great! Double 7 is 14, and double 14 is 28.",
  ),
  makeLesson(
    "Multiplication & division",
    "Division means sharing equally",
    "Division splits a total into equal groups. Each group gets the same amount.",
    [18, 12, 6],
    ["Start with 18 counters to share among 3 friends.", "Give each friend 1 counter at a time.", "Each friend gets 6 counters: 18 ÷ 3 = 6."],
    "If 18 counters are shared by 3 friends, how many does each get?",
    ["3", "6", "9"],
    1,
    "That's fair sharing: each friend gets 6.",
  ),
  makeLesson(
    "Multiplication & division",
    "Divide tens",
    "Share tens equally just like ones. Keep track of the place value.",
    [80, 60, 20],
    ["Start with 80, or 8 tens.", "Share the tens among 4 equal groups.", "Each group gets 2 tens, which is 20."],
    "What is 80 ÷ 4?",
    ["2", "20", "40"],
    1,
    "Correct! Eight tens shared in four groups gives two tens each.",
  ),
  makeLesson(
    "Multiplication & division",
    "Find a remainder",
    "A remainder is what is left after making as many equal groups as possible.",
    [23, 20, 4],
    ["Start with 23 counters and make groups of 5.", "Four full groups use 20 counters.", "Three counters are left over: 23 ÷ 5 is 4 remainder 3."],
    "What is 23 ÷ 5?",
    ["4 remainder 3", "5 remainder 4", "3 remainder 4"],
    0,
    "Exactly! Four groups of five use 20, with 3 left over.",
  ),
  makeLesson(
    "Multiplication & division",
    "Check division with multiplication",
    "Multiplication and division are partners. Multiply the answer by the group size to check.",
    [42, 42, 6],
    ["42 divided into 7 equal groups gives 6 in each group.", "Multiply the answer by the group size: 6 × 7.", "6 × 7 = 42, so the division checks out."],
    "Which multiplication checks 42 ÷ 7 = 6?",
    ["6 × 7 = 42", "6 + 7 = 42", "42 × 7 = 6"],
    0,
    "Yes! Multiplication confirms that 7 groups of 6 make 42.",
  ),
  makeLesson(
    "Multiplication & division",
    "Final mixed challenge",
    "Bring together place value, addition, and subtraction for one last challenge.",
    [236, 414, 320],
    ["Start with 236 and add 178: the total is 414.", "Now take away 94.", "320 remains: 236 + 178 − 94 = 320."],
    "What is 236 + 178 − 94?",
    ["310", "320", "330"],
    1,
    "You did it! 236 + 178 = 414, and 414 − 94 = 320.",
  ),
];

const lessons = [
  ...starterLessons.slice(0, 10),
  ...placeValueLessons,
  ...starterLessons.slice(10, 17),
  ...extraAdditionLessons,
  ...starterLessons.slice(17, 20),
  ...extraSubtractionLessons,
  ...multiplicationLessons,
];

const units = [...new Set(lessons.map(({ unit }) => unit))];

function AnimatedAbacusBoard({ value }) {
  const places = [
    { name: "HUNDREDS", digit: Math.floor(value / 100) % 10, x: 88 },
    { name: "TENS", digit: Math.floor(value / 10) % 10, x: 200 },
    { name: "ONES", digit: value % 10, x: 312 },
  ];

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border-4 border-amber-300 bg-amber-50 p-2 shadow-inner sm:p-4">
      <svg
        viewBox="0 0 400 410"
        role="img"
        aria-label={`Animated abacus showing ${value}`}
        className="block h-auto w-full"
      >
        <title>Abacus showing {value}</title>
        <rect x="4" y="4" width="392" height="402" rx="18" fill="#fffbeb" />
        {places.map(({ name, digit, x }) => {
          const lowerActive = digit % 5;

          return (
            <g key={name}>
              <text x={x} y="32" textAnchor="middle" fill="#475569" fontSize="13" fontWeight="700">
                {name}
              </text>
              <line x1={x} y1="45" x2={x} y2="345" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
              <ellipse
                cx={x}
                cy="55"
                rx="30"
                ry="14"
                fill={digit >= 5 ? "#7c3aed" : "#ddd6fe"}
                style={{
                  transform: `translateY(${digit >= 5 ? 57 : 0}px)`,
                  transformBox: "view-box",
                }}
                className="transition-all duration-700 ease-in-out motion-reduce:transition-none"
              />
              {[0, 1, 2, 3].map((bead) => {
                const isActive = bead < lowerActive;
                const targetY = isActive
                  ? 143 + bead * 25
                  : 255 + (bead - lowerActive) * 25;

                return (
                  <ellipse
                    key={bead}
                    cx={x}
                    cy="0"
                    rx="30"
                    ry="14"
                    fill={isActive ? "#7c3aed" : "#ddd6fe"}
                    style={{
                      transform: `translateY(${targetY}px)`,
                      transformBox: "view-box",
                    }}
                    className="transition-all duration-700 ease-in-out motion-reduce:transition-none"
                  />
                );
              })}
            </g>
          );
        })}
          <rect x="28" y="112" width="344" height="18" rx="9" fill="#f59e0b" />
          <text x="200" y="392" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="600">
            Beads touching the middle bar are active
        </text>
      </svg>
    </div>
  );
}

export default function Abacus() {
  const [value, setValue] = useState(7);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [visualStep, setVisualStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const lesson = lessons[lessonIndex];
  const isCorrect = selectedAnswer === lesson.answer;
  const isComplete = completedLessons.includes(lessonIndex);
  const unlockedLesson = Math.min(completedLessons.length, lessons.length - 1);
  const hundreds = Math.floor(value / 100);
  const tens = Math.floor(value / 10) % 10;
  const ones = value % 10;
  const visualValue = lesson.visualValues[visualStep];

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const timer = setTimeout(() => {
      if (visualStep >= lesson.steps.length - 1) {
        setIsPlaying(false);
      } else {
        setVisualStep((current) => Math.min(current + 1, lesson.steps.length - 1));
      }
    }, 1300);
    return () => clearTimeout(timer);
  }, [isPlaying, lesson.steps.length, visualStep]);

  function selectLesson(index) {
    if (index < 0 || index > unlockedLesson) {
      return;
    }

    setLessonIndex(index);
    setSelectedAnswer(null);
    setChecked(false);
    setVisualStep(0);
    setIsPlaying(false);
  }

  function changeVisualStep(nextStep) {
    setIsPlaying(false);
    setVisualStep(Math.max(0, Math.min(lesson.steps.length - 1, nextStep)));
  }

  function toggleAnimation() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (visualStep >= lesson.steps.length - 1) {
      setVisualStep(0);
    }
    setIsPlaying(true);
  }

  function updateValue(nextValue) {
    setValue(Math.max(0, Math.min(999, nextValue)));
  }

  function checkAnswer() {
    if (selectedAnswer === null) {
      return;
    }

    setChecked(true);
    if (isCorrect) {
      setCompletedLessons((current) => current.includes(lessonIndex)
        ? current
        : [...current, lessonIndex].sort((a, b) => a - b));
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="overflow-hidden rounded-3xl bg-linear-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white shadow-xl shadow-violet-950/10 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/15">
                <BookOpen size={25} aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                <Sparkles size={14} aria-hidden="true" /> Your abacus adventure
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Learn the abacus, one bead at a time</h1>
            <p className="mt-2 leading-7 text-violet-100">
              50 short lessons take you from your first bead to place value, big-number sums, multiplication, and division.
            </p>
          </div>
          <div className="min-w-36 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-3xl font-black">{completedLessons.length}<span className="text-violet-200">/{lessons.length}</span></p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-violet-100">Lessons passed</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-semibold text-violet-100">
            <span>Course progress</span>
            <span>{Math.round((completedLessons.length / lessons.length) * 100)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Abacus course progress"
            aria-valuemin={0}
            aria-valuemax={lessons.length}
            aria-valuenow={completedLessons.length}
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className="h-full rounded-full bg-amber-300 transition-all"
              style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="abacus-course-layout mt-5">
        <aside
          aria-label="Lesson selections"
          className="abacus-lesson-sidebar min-w-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold">Your learning path</h2>
            <p className="mt-1 text-sm text-slate-600">
              {completedLessons.length} of {lessons.length} lessons complete
            </p>
          </div>
          {units.map((unit) => {
            const unitLessons = lessons
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => item.unit === unit);
            const unitCompleted = unitLessons.filter(({ index }) => completedLessons.includes(index)).length;

            return (
              <details key={unit} open={lesson.unit === unit} className="group border-b border-slate-100 py-2 last:border-0">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-2 text-sm font-extrabold text-slate-700 hover:bg-violet-50 [&::-webkit-details-marker]:hidden">
                  <span>{unit}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                    {unitCompleted}/{unitLessons.length}
                  </span>
                </summary>
              <ol className="grid gap-1">
                {unitLessons.map(({ item, index }) => {
                  const isUnlocked = index <= unlockedLesson;
                  const isCurrent = lessonIndex === index;
                  const isPassed = completedLessons.includes(index);

                  return (
                    <li key={item.title} className="pl-1">
                      <button
                        type="button"
                        aria-label={`Lesson ${index + 1}: ${item.title}${isPassed ? ", completed" : ""}${!isUnlocked ? ", locked" : ""}`}
                        aria-current={isCurrent ? "step" : undefined}
                        disabled={!isUnlocked}
                        onClick={() => selectLesson(index)}
                        className={`flex min-h-11 w-full items-center gap-2 rounded-lg border-l-4 px-2.5 py-2 text-left text-sm font-semibold transition-colors ${
                          isCurrent
                            ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm"
                            : isPassed
                              ? "border-emerald-500 text-emerald-800 hover:bg-emerald-50"
                              : "border-transparent text-slate-700 hover:bg-slate-50"
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        <span className="w-5 shrink-0 text-center text-xs font-extrabold">
                          {isPassed ? <CheckCircle2 size={16} aria-hidden="true" /> : index + 1}
                        </span>
                        <span className="min-w-0 flex-1">{item.title}</span>
                        {!isUnlocked && <LockKeyhole size={14} aria-hidden="true" className="shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ol>
              </details>
            );
          })}
        </aside>

        <section aria-labelledby="lesson-heading" className="min-w-0 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-violet-800">{lesson.unit}</p>
            <p className="text-sm font-bold text-slate-500">Lesson {lessonIndex + 1} <span className="font-medium">of {lessons.length}</span></p>
          </div>
          <h2 id="lesson-heading" className="mt-4 text-2xl font-black sm:text-3xl">{lesson.title}</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">{lesson.intro}</p>
          <a
            href="#abacus-practice"
            onClick={() => setValue(lesson.demoValue)}
            className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-violet-200 px-3 text-sm font-bold text-violet-800 hover:bg-violet-50"
          >
            Try {lesson.demoValue} on the practice board
          </a>
          <section aria-labelledby="lesson-animation-heading" className="mt-5 rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 to-indigo-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
                  Step {visualStep + 1} of {lesson.steps.length}
                </p>
                <h3 id="lesson-animation-heading" className="mt-1 text-lg font-extrabold">
                  Watch it come to life
                </h3>
              </div>
              <button
                type="button"
                onClick={toggleAnimation}
                aria-pressed={isPlaying}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-700 px-3 text-sm font-bold text-white hover:bg-violet-800"
              >
                {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                {isPlaying ? "Pause" : "Play steps"}
              </button>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center">
              <AnimatedAbacusBoard value={visualValue} />
              <div className="rounded-xl border border-violet-100 bg-white p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">The abacus shows</p>
                <p className="mt-1 text-5xl font-black tabular-nums text-violet-800" aria-live="polite">
                  {visualValue}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {Math.floor(visualValue / 100)} {Math.floor(visualValue / 100) === 1 ? "hundred" : "hundreds"},{" "}
                  {Math.floor(visualValue / 10) % 10} {Math.floor(visualValue / 10) % 10 === 1 ? "ten" : "tens"}, and{" "}
                  {visualValue % 10} {visualValue % 10 === 1 ? "one" : "ones"}
                </p>
              </div>
            </div>
            <p className="mt-4 min-h-14 rounded-xl border border-violet-100 bg-white p-4 text-sm font-semibold leading-6 text-slate-700" aria-live="polite">
              {lesson.steps[visualStep]}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => changeVisualStep(visualStep - 1)}
                disabled={visualStep === 0}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={15} aria-hidden="true" /> Previous
              </button>
              <div className="flex gap-1.5" aria-label="Animation step progress">
                {lesson.steps.map((step, index) => (
                  <span
                    key={step}
                    className={`h-2 w-8 rounded-full ${index <= visualStep ? "bg-violet-600" : "bg-slate-300"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => changeVisualStep(visualStep + 1)}
                disabled={visualStep === lesson.steps.length - 1}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </section>
          <ol aria-label="Lesson steps" className="mt-4 grid gap-2 sm:grid-cols-3">
            {lesson.steps.map((step, index) => (
              <li
                key={step}
                aria-current={index === visualStep ? "step" : undefined}
                className={`flex gap-3 rounded-xl border p-3 text-sm leading-6 transition-colors motion-reduce:transition-none ${
                  index === visualStep ? "border-violet-300 bg-violet-50 text-slate-900" : "border-slate-100 bg-white text-slate-700"
                }`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-violet-700 text-xs font-extrabold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-amber-800">Quick check</p>
          <h3 className="mt-1 text-lg font-extrabold">Your turn</h3>
          <p className="mt-1 font-semibold text-slate-700">{lesson.question}</p>
          <fieldset className="mt-3 grid gap-2">
            <legend className="sr-only">Choose your answer</legend>
            {lesson.choices.map((choice, index) => (
              <label key={choice} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                selectedAnswer === index
                  ? "border-violet-500 bg-violet-50 text-violet-900"
                  : "border-slate-200 hover:border-violet-300"
              }`}>
                <input
                  type="radio"
                  name={`abacus-lesson-${lessonIndex}`}
                  value={index}
                  checked={selectedAnswer === index}
                  disabled={checked && isCorrect}
                  onChange={() => {
                    setSelectedAnswer(index);
                    setChecked(false);
                  }}
                  className="accent-violet-700"
                />
                {choice}
              </label>
            ))}
          </fieldset>
          {checked && (
            <p role="status" className={`mt-3 flex items-start gap-2 text-sm font-semibold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
              {isCorrect && <CheckCircle2 size={18} aria-hidden="true" className="shrink-0" />}
              {isCorrect ? lesson.explanation : "Not quite. Look back at the example and try again!"}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => selectLesson(lessonIndex - 1)}
              disabled={lessonIndex === 0}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Previous
            </button>
            <div className="flex flex-wrap gap-3">
              {!isComplete && (
                <button
                  type="button"
                  onClick={checkAnswer}
                  disabled={selectedAnswer === null || (checked && isCorrect)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Check answer
                </button>
              )}
              {lessonIndex < lessons.length - 1 && isComplete && (
                <button
                  type="button"
                  onClick={() => selectLesson(lessonIndex + 1)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-bold text-white hover:bg-violet-800"
                >
                  Next lesson <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
              {lessonIndex === lessons.length - 1 && isComplete && (
                <p className="flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-700" role="status">
                  <CheckCircle2 size={18} aria-hidden="true" />
                  You finished all 50 lessons. Great work!
                </p>
              )}
            </div>
          </div>
          {!isComplete && (
            <p className="mt-3 text-center text-xs text-slate-500">
              Get the answer right to unlock the next lesson.
            </p>
          )}
        </div>
      </section>
    </div>
    <section id="abacus-practice" aria-labelledby="visualizer-heading" className="mt-5 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
      <details>
        <summary className="cursor-pointer list-none rounded-xl p-1 text-lg font-extrabold text-slate-900 marker:hidden">
          Free practice board
          <span className="ml-2 text-sm font-medium text-slate-500">Build any number from 0 to 999</span>
        </summary>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="visualizer-heading" className="text-xl font-extrabold">Move the beads</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Try a number with the slider, number box, or step buttons.</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-bold">
              Number
              <input
                type="number"
                min="0"
                max="999"
                value={value}
                onChange={(event) => {
                  if (event.target.value === "") {
                    setValue(0);
                    return;
                  }
                  const nextValue = Number(event.target.value);
                  if (Number.isInteger(nextValue) && nextValue >= 0 && nextValue <= 999) {
                    setValue(nextValue);
                  }
                }}
                className="min-h-11 w-24 rounded-lg border border-slate-200 bg-white px-3 text-center text-lg font-extrabold text-slate-900 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                aria-label="Abacus number from 0 to 999"
              />
            </label>
          </div>
          <input
            type="range"
            min="0"
            max="999"
            value={value}
            onChange={(event) => updateValue(Number(event.target.value))}
            className="mt-4 w-full accent-violet-700"
            aria-label="Slide to change the abacus number"
          />
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {[
              { label: "Take away 100", amount: -100, text: "−100" },
              { label: "Take away 10", amount: -10, text: "−10" },
              { label: "Take away 1", amount: -1, text: "−1" },
              { label: "Add 1", amount: 1, text: "+1" },
              { label: "Add 10", amount: 10, text: "+10" },
              { label: "Add 100", amount: 100, text: "+100" },
            ].map(({ label, amount, text }) => (
              <button
                key={label}
                type="button"
                onClick={() => updateValue(value + amount)}
                disabled={value + amount < 0 || value + amount > 999}
                className="min-h-10 rounded-lg border border-violet-200 px-3 text-sm font-bold text-violet-800 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {text}
                <span className="sr-only"> {label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 sm:p-5">
            <AnimatedAbacusBoard value={value} />
          </div>
          <p className="mt-3 text-center text-sm font-semibold text-slate-600" aria-live="polite">
            {value} is {hundreds} {hundreds === 1 ? "hundred" : "hundreds"}, {tens} {tens === 1 ? "ten" : "tens"}, and {ones} {ones === 1 ? "one" : "ones"}.
          </p>
        </div>
      </details>
    </section>
    </div>
  );
}
