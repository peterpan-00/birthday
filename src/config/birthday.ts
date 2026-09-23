export type ChapterLayout =
  | "hero"
  | "centered"
  | "asymmetric"
  | "floating"
  | "polaroid"
  | "fullscreen"
  | "overlapping"
  | "portraitOversized"
  | "twoPhoto"
  | "whitespace"
  | "perspective3D";

export type AnimationPreset =
  | "fadeBlur"
  | "zoomReveal"
  | "scaleReveal"
  | "slideDepth"
  | "perspectiveTilt"
  | "maskReveal"
  | "polaroidEntrance"
  | "floatingCard"
  | "parallaxDepth"
  | "horizontalReveal"
  | "cinematicPan"
  | "layeredReveal";

export interface PhotoChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  message: string;
  caption?: string;
  microcopy?: string;
  layout: ChapterLayout;
  animation: AnimationPreset;
  tag?: string;
  aspectRatio?: "portrait" | "landscape" | "square";
  accentColor?: string;
  secondaryPhotoId?: string;
}

export interface InteractiveStar {
  id: string;
  xPercent: number;
  yPercent: number;
  message: string;
}

export const birthdayConfig = {
  dateOfBirth: "2006-09-26",
  /** MM-DD portion of the birthday */
  birthdayDate: "09-26",
  birthYear: 2006,
  /** The year this birthday experience is celebrating */
  celebrationYear: 2026,
  /** Pet name used in the cinematic reveal */
  nickname: "Mau",
  /** Returns the age being celebrated: celebrationYear − birthYear */
  getAge: (targetYear = 2026): number => {
    return targetYear - 2006;
  },
  /**
   * Returns the formatted celebration date string, e.g. "26 September 2026".
   * Derived entirely from config fields — never hard-coded.
   */
  formatCelebrationDate(): string {
    // dateOfBirth is "YYYY-MM-DD"; extract day + month from it
    const [, monthStr, dayStr] = this.dateOfBirth.split("-");
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${day} ${monthNames[month - 1]} ${this.celebrationYear}`;
  },
};

export const birthdayContent = {
  person: {
    fullName: "Tanishka",
    petName: "Tanu",
    familyName: "Mau",
    role: "Our One & Only Maushi",
    creators: "Me & My Little Sister",
  },

  hero: {
    badge: "For Our Favorite Maushi",
    heading: "Happy 20th Birthday, Mau! 🎂✨",
    subheading: "20 years of being you.",
    scrollHint: "Scroll into your memories ↓",
    heroPhotoId: "mau-01",
  },

  nameMetamorphosis: {
    eyebrow: "The Evolution of a Name",
    steps: [
      { name: "Tanishka", note: "The official name on paper" },
      { name: "Tanu", note: "The cute nickname everyone knows" },
      { name: "MAU ❤️", note: "Who you truly are to us" },
    ],
    closingText: "Because that's who you are to us. Our safe place, our partner in crime, and our favorite person.",
  },

  sisterSection: {
    eyebrow: "Special Chapter",
    heading: "Mau & Her Little Partner in Crime ❤️",
    subheading: "Some bonds don't need explaining.",
    quote: "“Just two people collecting way too many memories, stealing snacks, and causing 99% of the household chaos.”",
    photos: ["mau-11", "mau-12", "mau-13"],
    notes: [
      "No secret is safe when these two get together.",
      "The unspoken agreement: whatever happens, don't tell mom.",
      "Pure, unfiltered sisterhood energy.",
    ],
  },

  interactiveSurprises: {
    stars: [
      { id: "star-1", xPercent: 18, yPercent: 22, message: "You are genuinely loved more than words can say. ✨" },
      { id: "star-2", xPercent: 82, yPercent: 35, message: "Never change that bright, contagious smile! 😊" },
      { id: "star-3", xPercent: 25, yPercent: 70, message: "Mau moment unlocked: certified family favourite! 🏆" },
      { id: "star-4", xPercent: 75, yPercent: 80, message: "Family memories > everything in the world. ❤️" },
      { id: "star-5", xPercent: 50, yPercent: 48, message: "Thank you for always being in our corner! 🌟" },
    ] as InteractiveStar[],
    secretSurprise: {
      buttonText: "Mau… one more thing 👀",
      heading: "A Little Secret From Both of Us 💌",
      message:
        "Whenever life gets busy or chaotic, remember this little world we built for you. You bring so much light, laughter, and comfort to our lives. We could not have asked for a cooler, sweeter, or more wonderful maushi. Here's to making a million more memories together!",
      revealPhotoId: "mau-18",
    },
  },

  finalSection: {
    heading: "Happy Birthday, Mau. ❤️",
    namesBreakdown: [
      { line: "Tanishka." },
      { line: "Tanu." },
      { line: "Mau." },
    ],
    highlight: "Different names. Same person. One very special maushi.",
    emotionalParagraphs: [
      "We may tease you, annoy you and create chaos around you…",
      "but we are really lucky to have you in our lives.",
      "Happy Birthday, Mau. ❤️",
    ],
    finalPhotoId: "mau-17",
    // Add IDs here for any extra real photos you provide for the final fan deck.
    // Example: "mau-extra-01" (and place mau-extra-01.jpg in private/photos).
    // Every uploaded memory remains reachable in the final interactive fan deck.
    finalStackPhotoIds: [
      "mau-19", "mau-20", "mau-21", "mau-22", "mau-23", "mau-24", "mau-25",
      "mau-26", "mau-27", "mau-28", "mau-29", "mau-30", "mau-31",
    ] as string[],
    signoff: "With endless love,\nFrom your favorite little troublemakers ✨",
  },

  // 18 Visual Chapters with distinct layout and animation combinations
  chapters: [
    {
      id: "mau-02",
      chapterNumber: 1,
      title: "The Protagonist Enters",
      subtitle: "Chapter 01",
      message: "Every great story starts with someone who effortlessly lights up every room she steps into.",
      caption: "Main character energy ✨",
      microcopy: "Okay… this photo is actually too good.",
      layout: "centered",
      animation: "zoomReveal",
      tag: "The Beginning",
      aspectRatio: "portrait",
    },
    {
      id: "mau-03",
      chapterNumber: 2,
      title: "Grace & Unstoppable Laughter",
      subtitle: "Chapter 02",
      message: "There is an art to taking life in stride and smiling through whatever comes your way.",
      caption: "Keep that smile.",
      microcopy: "Mau being Mau.",
      layout: "asymmetric",
      animation: "slideDepth",
      tag: "Pure Joy",
      aspectRatio: "portrait",
    },
    {
      id: "mau-04",
      chapterNumber: 3,
      title: "The Fun Never Leaves",
      subtitle: "Chapter 03",
      message: "The best kind of memories are the ones where you can be completely, wonderfully yourself.",
      caption: "A little mischief, a lot of joy.",
      microcopy: "Certified classic 📸",
      layout: "polaroid",
      animation: "polaroidEntrance",
      tag: "Nostalgia",
      aspectRatio: "square",
    },
    {
      id: "mau-05",
      chapterNumber: 4,
      title: "A Little Sea, A Lot of Sunshine",
      subtitle: "Chapter 04",
      message: "Some memories feel like a deep breath — bright skies, open water, and that familiar smile.",
      caption: "Sun, sea, and a perfect day.",
      microcopy: "Family favourite detected.",
      layout: "whitespace",
      animation: "fadeBlur",
      tag: "Serenity",
      aspectRatio: "portrait",
    },
    {
      id: "mau-19",
      chapterNumber: 5,
      title: "Adventure Looks Good on You",
      subtitle: "Chapter 05",
      message: "May this next year bring more waves to chase, more places to see, and more reasons to smile.",
      caption: "Here is to the next adventure.",
      microcopy: "This one deserved its own chapter.",
      layout: "fullscreen",
      animation: "cinematicPan",
      tag: "Visions",
      aspectRatio: "landscape",
    },
    {
      id: "mau-06",
      chapterNumber: 6,
      title: "The Safest Kind of Hug",
      subtitle: "Chapter 06",
      message: "In every version of life, the people who hold you close make the biggest moments feel like home.",
      caption: "Love you can feel.",
      microcopy: "The warmest memory.",
      layout: "overlapping",
      animation: "layeredReveal",
      tag: "Chronicles",
      aspectRatio: "portrait",
      secondaryPhotoId: "mau-07",
    },
    {
      id: "mau-23",
      chapterNumber: 7,
      title: "Love, Held Close",
      subtitle: "Chapter 07",
      message: "The quietest pictures can carry the loudest love — this one says everything without a word.",
      caption: "Always, always family.",
      microcopy: "A forever kind of bond. ✨",
      layout: "portraitOversized",
      animation: "maskReveal",
      tag: "Style",
      aspectRatio: "portrait",
    },
    {
      id: "mau-08",
      chapterNumber: 8,
      title: "Birthday Joy, Shared",
      subtitle: "Chapter 08",
      message: "Your smile makes every celebration brighter — especially when your favorite little people are close.",
      caption: "A beautiful reason to celebrate.",
      microcopy: "Good vibes only.",
      layout: "floating",
      animation: "floatingCard",
      tag: "Radiance",
      aspectRatio: "portrait",
    },
    {
      id: "mau-09",
      chapterNumber: 9,
      title: "Made for the Little Moments",
      subtitle: "Chapter 09",
      message: "The giggles, the cuddles, the ordinary days — these are the memories that become everything.",
      caption: "Love in every little frame.",
      microcopy: "Never a dull second.",
      layout: "twoPhoto",
      animation: "horizontalReveal",
      tag: "Duality",
      aspectRatio: "portrait",
      secondaryPhotoId: "mau-10",
    },
    {
      id: "mau-22",
      chapterNumber: 10,
      title: "Depth & Perspective",
      subtitle: "Chapter 10",
      message: "A reminder of how much you mean to every single one of us.",
      caption: "Standing tall in all our memories.",
      microcopy: "A true gem 💎",
      layout: "perspective3D",
      animation: "perspectiveTilt",
      tag: "Dimension",
      aspectRatio: "portrait",
    },
    {
      id: "mau-20",
      chapterNumber: 11,
      title: "The Inseparable Duo",
      subtitle: "Chapter 11",
      message: "When Mau and her favorite little sister join forces, zero rules apply and 100% fun is guaranteed.",
      caption: "Troublemakers in action.",
      microcopy: "Double trouble.",
      layout: "asymmetric",
      animation: "slideDepth",
      tag: "Partners in Crime",
      aspectRatio: "landscape",
    },
    {
      id: "mau-24",
      chapterNumber: 12,
      title: "Sweetest Sisterly Hugs",
      subtitle: "Chapter 12",
      message: "Warmth that feels like home. The kind of bond time and distance could never change.",
      caption: "Pure love, zero filter.",
      microcopy: "Heart melted 🥹",
      layout: "centered",
      animation: "scaleReveal",
      tag: "Family",
      aspectRatio: "portrait",
    },
    {
      id: "mau-25",
      chapterNumber: 13,
      title: "Candid Perfection",
      subtitle: "Chapter 13",
      message: "Unposed, authentic, and filled with the genuine joy that makes family everything.",
      caption: "Real smiles hit different.",
      microcopy: "Frame-worthy 🖼️",
      layout: "polaroid",
      animation: "polaroidEntrance",
      tag: "Candid",
      aspectRatio: "square",
    },
    {
      id: "mau-26",
      chapterNumber: 14,
      title: "Golden Hour Glow",
      subtitle: "Chapter 14",
      message: "Sunlit memories that will always stay warm and vivid.",
      caption: "Basking in the best days.",
      microcopy: "Golden girl 🌅",
      layout: "whitespace",
      animation: "fadeBlur",
      tag: "Golden Hour",
      aspectRatio: "portrait",
    },
    {
      id: "mau-27",
      chapterNumber: 15,
      title: "Endless Celebrations",
      subtitle: "Chapter 15",
      message: "Here's to all the birthdays before this, and all the magical ones yet to come.",
      caption: "Cheers to another chapter.",
      microcopy: "Forever young at heart 🥂",
      layout: "floating",
      animation: "floatingCard",
      tag: "Celebration",
      aspectRatio: "portrait",
    },
    {
      id: "mau-28",
      chapterNumber: 16,
      title: "Quiet Reflections",
      subtitle: "Chapter 16",
      message: "A little moment to pause and appreciate just how incredible you are.",
      caption: "Soft reflections.",
      microcopy: "One of a kind ✨",
      layout: "perspective3D",
      animation: "perspectiveTilt",
      tag: "Reflections",
      aspectRatio: "portrait",
    },
    {
      id: "mau-29",
      chapterNumber: 17,
      title: "The Keepsake",
      subtitle: "Chapter 17",
      message: "A portrait of love, laughter, and everything we cherish about you.",
      caption: "The heart of it all.",
      microcopy: "Our Mau ❤️",
      layout: "centered",
      animation: "zoomReveal",
      tag: "Keepsake",
      aspectRatio: "portrait",
    },
  ] as PhotoChapter[],
};
