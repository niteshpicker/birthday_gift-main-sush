export interface PageConfig {
  id: 'letter' | 'story' | 'wishes' | 'moments' | 'candles' | 'videos' | 'wish';
  title: string;
  subtitle?: string;
  badge: string;
  heading: string;
}

export interface StoryChapter {
  chapterNumber: number;
  label: string;
  imageUrl: string;
  imageAlt: string;
  backdropColor: string;
  text: string;
}

export interface WishItem {
  id: string;
  color:
    | 'pink'
    | 'lavender'
    | 'mint'
    | 'yellow'
    | 'coral'
    | 'sky'
    | 'apricot'
    | 'orchid'
    | 'lime'
    | 'aqua';
  text: string;
}

export interface MomentPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  backdropColor: string;
}

export interface BirthdayMockData {
  recipientName: string;
  senderName: string;
  birthdayDate: string;
  audioUrl: string;
  pages: PageConfig[];
  cover: {
    dateBadge: string;
    titleLine1: string;
    recipientName: string;
    handwrittenPrefix: string;
    handwrittenHighlight: string;
    subtitle: string;
    todayBadge: string;
    ctaButtonText: string;
    dragHint: string;
  };
  letter: {
    badge: string;
    title: string;
    greeting: string;
    paragraphs: string[];
    signOff: string;
    pullHint: string;
  };
  story: {
    chapters: StoryChapter[];
    continuedText: string;
  };
  wishes: {
    items: WishItem[];
    ctaLabel: string;
    instructionIdle: string;
    instructionHolding: string;
    instructionFalling: string;
    instructionAfterWish: string;
  };
  moments: {
    marqueeTitle: string;
    dateStamp: string;
    photos: MomentPhoto[];
    stickers: string[];
    ctaLabel: string;
    printingLabel: string;
    photoCountLabel: string;
    printAgainLabel: string;
  };
  candles: {
    badge: string;
    litHeading: string;
    blownHeading: string;
    blownSubtitle: string;
    holdLabel: string;
    relightLabel: string;
    candleColors: string[];
  };
  finale: {
    age: string;
    badge: string;
    headingPrefix: string;
    recipientShortName: string;
    signOffLine1: string;
    signOffLine2: string;
    watchAgainLabel: string;
  };
}

export const mockData: BirthdayMockData = {
  recipientName: 'Sush',
  senderName: 'Nitesh',
  birthdayDate: 'NOVEMBER 23',
  // Background track stored locally in public/audio/ (falls back cleanly to Web Audio music-box synthesis if offline)
  audioUrl: '/audio/Shiki-Perfect_audio.mp3',
  pages: [
    {
      id: 'letter',
      title: 'The letter',
      badge: 'OPEN THE ENVELOPE',
      heading: 'A letter for you',
    },
    {
      id: 'story',
      title: 'Your story',
      badge: 'CHAPTER BY CHAPTER',
      heading: 'Your story',
    },
    {
      id: 'wishes',
      title: 'Wishes',
      badge: 'MAKE A WISH!!',
      heading: 'Wishes for your new year',
    },
    {
      id: 'moments',
      title: 'Moments',
      badge: 'SAY CHEESE!',
      heading: 'Your moments',
    },
    {
      id: 'candles',
      title: 'The candles',
      badge: 'MAKE A WISH',
      heading: 'Blow out the candles',
    },
    {
      id: 'videos',
      title: 'Video wishes',
      badge: 'A LITTLE SURPRISE',
      heading: 'Birthday wishes for you',
    },
    {
      id: 'wish',
      title: 'The wish',
      subtitle: 'WISH MADE',
      badge: 'WISH MADE',
      heading: 'Happy birthday',
    },
  ],
  cover: {
    dateBadge: 'NOVEMBER 23',
    titleLine1: 'Happy birthday,',
    recipientName: 'Sush',
    handwrittenPrefix: 'for being so',
    handwrittenHighlight: 'amazing',
    subtitle: '',
    todayBadge: 'Today is your day!',
    ctaButtonText: 'Open my gift',
    dragHint: 'Drag cake to spin',
  },
  letter: {
    badge: 'OPEN THE ENVELOPE',
    title: 'A letter for you',
    greeting: 'Dear Sush,',
paragraphs: [
  'And just like that, a new year of age has arrived. You have been through a lot this past year, with so many different emotions, and today is your birthday, the day that marks a new milestone in your life. I hope you had a really meaningful day.',
  "We haven't had the chance to meet for quite a while now. I hope we can meet up on some nice day and chat about random things.",
  'You are a real gem of a person, and I wish you a great year ahead. May all your wishes come true! :))',
],
signOff: 'Warm regards, Nitesh',
    pullHint: 'PULL UP TO READ FULL',
  },
  story: {
    chapters: [
      {
        chapterNumber: 1,
        label: 'Chapter "30"',
        imageUrl: '/images/graduate.jpeg',
        imageAlt: 'Chapter 1 memory illustration',
        backdropColor: '#D7EDE4',
        text: "Whatever the past year took from you, I hope the next one gives it back and more.",
      },
      {
        chapterNumber: 2,
        label: 'Chapter "31"',
        imageUrl: '/images/suss.jpeg',
        imageAlt: 'Chapter 2 memory illustration',
        backdropColor: '#ECE3FA',
text: 'As you step into a new year with new plans, I hope you stay strong and resilient, overcome every difficulty, and achieve everything you set out to do!!',      },
    ],
    continuedText: 'To be continued...',
  },
  wishes: {
    items: [
     { id: 'w1', color: 'pink', text: 'May every storm stop outside your door' },
{ id: 'w2', color: 'lavender', text: 'May you eat well, sleep deeply, and always be full of energy' },
{ id: 'w3', color: 'mint', text: 'May your wallet always be full enough to freely do what you love' },
{ id: 'w4', color: 'yellow', text: 'May you always meet kind people and be kind to everyone' },
{ id: 'w5', color: 'coral', text: 'May you always love yourself' },
{
  id: 'w6',
  color: 'sky',
  text: 'May every plan you have been nurturing come true.',
},
{
  id: 'w7',
  color: 'apricot',
  text: 'May every day pass gently and be filled with joy.',
},
{
  id: 'w8',
  color: 'orchid',
  text: 'May you have many more fun trips and new experiences.',
},
{
  id: 'w9',
  color: 'lime',
  text: 'May the little things around you always make you smile.',
},
{
  id: 'w10',
  color: 'aqua',
  text: 'May luck and peace always walk beside you in your new year.',
},
],
ctaLabel: 'Make a wish again',
instructionIdle: 'Press and hold, shake the jar, then release to receive a random wish',
instructionHolding: 'Shaking the star jar... release so the star can fly up!',
instructionFalling: 'The star is falling down, carrying your wish...',
instructionAfterWish: 'Press and hold and shake the jar again to draw another wish',
},
  moments: {
    marqueeTitle: 'Photobooth',
    dateStamp: '',
    photos: [
      {
        id: 'm1',
        imageUrl: '/images/pt1.jpeg',
        caption: 'Pretty',
        backdropColor: '#FCE6DA',
      },
      {
        id: 'm2',
        imageUrl: '/images/pt2.jpeg',
        caption: 'Beautiful',
        backdropColor: '#FDF0DE',
      },
      {
        id: 'm3',
        imageUrl: '/images/pt3.jpeg',
        caption: 'Truly',
        backdropColor: '#FCE4EC',
      },
      {
        id: 'm4',
        imageUrl: '/images/pt4.jpeg',
        caption: 'Wonderful!',
        backdropColor: '#E8F4F2',
      },
    ],
    stickers: [
      '/stickers/shin_chan_STICKER.gif',
      '/stickers/gd.gif',
      '/stickers/capybara.gif',
      '/stickers/cat_meme.gif',
      '/stickers/cat_fight.gif',
    ],
    ctaLabel: 'Print all',
    printingLabel: 'Printing...',
    photoCountLabel: '4 photos',
    printAgainLabel: 'Print again',
  },
  candles: {
    badge: 'MAKE A WISH',
    litHeading: 'Blow out the candles',
    blownHeading: 'Wish made! Happy Birthday!',
    blownSubtitle:
      'Wanna try again??',
    holdLabel: 'Hold',
    relightLabel: 'Light candles again',
    candleColors: ['#9CE0CC', '#F9DE7E', '#F79EB3', '#BFA3E8', '#F5959E'],
  },
  finale: {
    age: '31',
    badge: 'years old',
    headingPrefix: 'Happy birthday,',
    recipientShortName: 'Sush',
    signOffLine1: 'With warmest wishes,',
    signOffLine2: '',
    watchAgainLabel: 'Watch again',
  },
};
