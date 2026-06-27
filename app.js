const storyCards = [...document.querySelectorAll(".story-card")];
const progressDots = document.querySelector(".progress-dots");
const tapLayer = document.querySelector(".tap-layer");
const storyStart = document.querySelector(".story-start");
const screens = [...document.querySelectorAll(".screen")];
const characterCarousel = document.querySelector("#characterCarousel");
const companionCarousel = document.querySelector("#companionCarousel");
const companionName = document.querySelector("#companionName");
const homeFrame = document.querySelector(".home-frame");
const homeCharacter = document.querySelector("#homeCharacter");
const homeCompanion = document.querySelector("#homeCompanion");
const homeMessage = document.querySelector("#homeMessage");
const homeCtaLabel = document.querySelector(".home-cta-label");
const featuredDemon = document.querySelector("#featuredDemon");
const demonGrid = document.querySelector("#demonGrid");
const battleFrame = document.querySelector("#battleFrame");
const resultFrame = document.querySelector("#resultFrame");

let storyIndex = 0;
let selectedCharacter = "Your name";
let selectedCompanion = "Froderick";
let selectedDemon = "Self-Doubt Mirror";
let battleSeconds = 180;
let battleTimer;
let previewOutcome = "lost";
let currentBattle;

function setFrameScale() {
  const margin = 36;
  const frameWidth = 402;
  const frameHeight = 874;
  const scale = Math.min(
    1,
    (window.innerWidth - margin) / frameWidth,
    (window.innerHeight - margin) / frameHeight
  );
  const safeScale = Math.max(0.1, scale);

  document.documentElement.style.setProperty("--frame-scale", safeScale.toFixed(4));
  document.documentElement.style.setProperty("--stage-width", `${frameWidth * safeScale}px`);
  document.documentElement.style.setProperty("--stage-height", `${frameHeight * safeScale}px`);
}

const characters = [
  { name: "Your name", type: "sproutling", image: "./assets/characters/1 default.png" },
  { name: "Ember", type: "ember" },
  { name: "Moonbun", type: "moonbun" },
];

const companions = [
  {
    name: "Froderick",
    type: "companion-frog",
    image: "./assets/companions/froderick.png",
    tags: ["elegant", "attentive", "magical"],
    theme: "sage",
  },
  {
    name: "Kat",
    type: "companion-cat",
    image: "./assets/companions/kat.png",
    tags: ["sassy", "clever", "playful"],
    theme: "plum",
  },
  {
    name: "Birdie",
    type: "companion-bird",
    image: "./assets/companions/birdie.png",
    tags: ["derpy", "clumsy", "apologetic"],
    theme: "periwinkle",
  },
  {
    name: "Sheldon",
    type: "companion-turtle",
    image: "./assets/companions/sheldon.png",
    tags: ["wise", "calm", "nerdy"],
    theme: "honey",
  },
];

const demons = [
  {
    name: "Self-Doubt Mirror",
    image: "./assets/demons/selfdoubt mirror default.png",
    tags: ["emptiness", "comparison", "fragile"],
    theme: "lilac",
    featured: true,
  },
  {
    name: "Blackhole of Emptiness",
    image: "./assets/demons/blackhole of emptiness.png",
    tags: ["emptiness", "compulsive", "numbing"],
    theme: "lilac",
  },
  {
    name: "Letdown Raincloud",
    image: "./assets/demons/letdown raincloud.png",
    tags: ["doubtcast", "gloomy", "hopeless"],
    theme: "blue",
  },
  {
    name: "Overthinking Hydra",
    image: "./assets/demons/overthinking hydra.png",
    tags: ["spiraling", "replays", "what-ifs"],
    theme: "mint",
  },
  {
    name: "Doomscroll Siren",
    image: "./assets/demons/doomscroll siren.png",
    tags: ["addictive", "distracting", "luring"],
    theme: "pink",
  },
  {
    name: "Indecisive Bat",
    image: "./assets/demons/Indecisive bat.png",
    tags: ["fear", "unsure", "stuck"],
    theme: "blush",
  },
  {
    name: "Sleepless Ghost",
    image: "./assets/demons/Sleepless ghost.png",
    tags: ["tired", "restless", "drained"],
    theme: "lavender",
  },
  {
    name: "Lost Pixie",
    image: "./assets/demons/lost pixie.png",
    tags: ["scattered", "floaty", "confused"],
    theme: "cream",
  },
  {
    name: "Avoidant Snail",
    image: "./assets/demons/avoidant snail.png",
    tags: ["avoidant", "slow", "distracted"],
    theme: "peach",
  },
  {
    name: "Can't Zombie",
    image: "./assets/demons/can't zombie.png",
    tags: ["drained", "melted", "core"],
    theme: "pink",
  },
  {
    name: "Hater Snake",
    image: "./assets/demons/hater snake.png",
    tags: ["sharp", "judgey", "petty"],
    theme: "moss",
  },
  {
    name: "Too Hard Dragon",
    image: "./assets/demons/too hard dragon.png",
    tags: ["intense", "too much", "hot"],
    theme: "peach",
  },
  {
    name: "Anxiety Spider",
    image: "./assets/demons/anxiety spider.png",
    tags: ["trapped", "nervous", "sticky"],
    theme: "pink",
  },
];

const fightExamples = {
  lost: {
    outcome: "lost",
    demonName: "Hater Snake",
    demonImage: "./assets/demons/hater snake attack.png",
    resultImage: "./assets/demons/hater snake.png",
    heroImage: "./assets/characters/1 defeated.png",
    title: "You almost slayed!",
    copy: "You tried to resist Hater Snake!",
    xp: "5+ Slay XP",
    record: "0 wins/2 battles",
    demonHearts: 2,
    heroHearts: 0,
    userMessage: "tbh I really do and I can't get over it rn",
    demonReply: "That's right... just keep hating.. HISS",
    fadedMessage: "I hate everything about him!",
  },
  win: {
    outcome: "win",
    demonName: "Doomscroll Siren",
    demonImage: "./assets/demons/doomscroll siren defeated.png",
    resultImage: "./assets/demons/doomscroll siren.png",
    heroImage: "./assets/characters/1 excited.png",
    title: "Slayed!",
    copy: "You resisted Doomscroll Siren!",
    xp: "20+ Slay XP",
    record: "3 wins/5 battles",
    demonHearts: 0,
    heroHearts: 2,
    userMessage: "I won!",
    demonReply: "Nooo I just wanted to have some fun...",
    fadedMessage: "I decided, I'm gonna go for a run instead",
  },
};

const demonVoices = {
  "Self-Doubt Mirror": {
    openers: [
      "Look again. Are you sure that's enough?",
      "I can show you every tiny flaw, if you want proof.",
      "What if everyone else sees what I see?",
    ],
    replies: [
      "Hmm. A brave answer, but the glass still remembers.",
      "Careful... confidence leaves fingerprints.",
      "Maybe you're not broken. Maybe you're just squinting.",
    ],
  },
  "Blackhole of Emptiness": {
    openers: [
      "Come closer. Nothing is easier than everything.",
      "Why choose a quest when you can sink into the soft dark?",
      "Snacks, tabs, games, silence... all roads lead to me.",
    ],
    replies: [
      "Mmm, a tiny spark. I suppose I can swallow slower.",
      "You named the pull. That makes you heavier in a good way.",
      "Fine, orbit if you must. Just don't forget I am cozy.",
    ],
  },
  "Letdown Raincloud": {
    openers: [
      "It's probably going to disappoint you anyway.",
      "I brought drizzle for your enthusiasm.",
      "Hope is just weather with worse timing.",
    ],
    replies: [
      "That was almost sunny. Suspicious.",
      "A small umbrella of reason. How quaint.",
      "You can keep going, but I reserve the right to mist dramatically.",
    ],
  },
  "Overthinking Hydra": {
    openers: [
      "But what about the fifth possible consequence?",
      "I made seven backup worries while you were breathing.",
      "If we analyze this forever, nothing can surprise us.",
    ],
    replies: [
      "One head quieted. Naturally, six have notes.",
      "A simple answer? Bold. Unsettling. Continue.",
      "You chose one thread. I am offended and impressed.",
    ],
  },
  "Doomscroll Siren": {
    openers: [
      "Just one more swipe, darling. The world might need you anxious.",
      "Your thumb misses me. I can tell.",
      "There is fresh chaos. Wouldn't it be rude not to look?",
    ],
    replies: [
      "Nooo, but the feed prepared a little spiral for you.",
      "A boundary? In this economy?",
      "Fine, touch grass. I will be here, dramatically refreshed.",
    ],
  },
  "Indecisive Bat": {
    openers: [
      "Left? Right? Wait, what if hovering is safer?",
      "I circled the choice three times and learned nothing.",
      "Maybe the best decision is another lap.",
    ],
    replies: [
      "A direction? My wings are shocked.",
      "Tiny choice detected. Mildly terrifying. Very useful.",
      "You moved before certainty arrived. Witchcraft.",
    ],
  },
  "Sleepless Ghost": {
    openers: [
      "Psst. Remember that thing from 2017?",
      "Sleep is nice, but what if we rehearsed tomorrow badly?",
      "I brought a blanket and seventeen thoughts.",
    ],
    replies: [
      "Rude of you to be gentle with yourself.",
      "A softer thought... I may haunt at half volume.",
      "Fine. One less chain-rattle.",
    ],
  },
  "Lost Pixie": {
    openers: [
      "Wasn't there a task? Or a window? Or a shiny thing?",
      "I put the plan somewhere whimsical and unmarked.",
      "Let's flutter away from the point together.",
    ],
    replies: [
      "A list? How scandalously grounded.",
      "You found one step. I misplaced my argument.",
      "Fine, map-maker. Lead on.",
    ],
  },
  "Avoidant Snail": {
    openers: [
      "We could do it later. Later has such a lovely shell.",
      "The task can't see us if we are very still.",
      "Retreat is basically planning, but rounder.",
    ],
    replies: [
      "A tiny start? Hmph. My shell felt that.",
      "You may proceed, but slowly and with snacks.",
      "Fine. We can peek at the task. No sudden heroics.",
    ],
  },
  "Can't Zombie": {
    openers: [
      "Can't. Nope. Brain soup. Lie down.",
      "The word 'try' has left the building.",
      "All buttons are too many buttons.",
    ],
    replies: [
      "A small can? Suspiciously alive.",
      "You don't need a whole self. A toe of effort counts.",
      "Fine. We can do the tiniest version.",
    ],
  },
  "Hater Snake": {
    openers: [
      "Hiss. Let us rehearse why they are the worst.",
      "Keep the grudge warm. It makes us feel tall.",
      "I saved three sharp comments for later.",
    ],
    replies: [
      "That's right... name the venom before it names you.",
      "A calmer boundary? Less dramatic, but annoyingly strong.",
      "Fine. We can dislike and still not become poison.",
    ],
  },
  "Too Hard Dragon": {
    openers: [
      "This quest is huge. Better admire it from far away.",
      "I brought flames for every step after step one.",
      "Only a legendary hero could start this. Conveniently not us.",
    ],
    replies: [
      "One tiny step? That is not in my epic contract.",
      "You made it smaller. My flames hate that.",
      "Fine. A hatchling-sized version may proceed.",
    ],
  },
  "Anxiety Spider": {
    openers: [
      "I wove a web from every possible maybe.",
      "Careful. The floor is made of what-ifs.",
      "Let's stay tangled until certainty apologizes.",
    ],
    replies: [
      "A breath cut one strand. Unnecessary but effective.",
      "You can move with the web still here. Annoying.",
      "Fine. One gentle untangle.",
    ],
  },
};

const demonAttackClarifiers = {
  "Self-Doubt Mirror": [
    {
      label: "You feel ugly",
      replies: ["Yes, inspect every angle. Surely one will explain everything.", "If you call it ugly first, no one else gets to surprise you."],
    },
    {
      label: "You feel behind",
      replies: ["Everyone else is moving faster. Look, I polished the comparison glass.", "Late, late, late. Shall I show you a highlight reel?"],
    },
    {
      label: "You feel fake",
      replies: ["Maybe they will notice you are improvising. Maybe they already did.", "Keep smiling. The reflection knows you are guessing."],
    },
  ],
  "Blackhole of Emptiness": [
    {
      label: "You feel numb",
      replies: ["Exactly. Sink where nothing asks anything from you.", "No wants, no edges, no effort. So peaceful, right?"],
    },
    {
      label: "You want to binge",
      replies: ["One more snack, one more tab, one more tiny disappearance.", "Why feel the feeling when the pantry glows softly?"],
    },
    {
      label: "You feel pointless",
      replies: ["Purpose is heavy. I can hold it under the dark for you.", "If nothing matters, then nothing needs starting."],
    },
  ],
  "Letdown Raincloud": [
    {
      label: "You expect failure",
      replies: ["There it is. Brace early and maybe it will hurt less.", "Why hope when disappointment is already dressed?"],
    },
    {
      label: "You feel disappointed",
      replies: ["Let the drizzle prove you were right to expect less.", "A soggy little prophecy. Familiar, isn't it?"],
    },
    {
      label: "You feel hopeless",
      replies: ["The sky is heavy. No need to pretend it will clear.", "Hope makes such a bright target for rain."],
    },
  ],
  "Overthinking Hydra": [
    {
      label: "You are replaying",
      replies: ["Again from the top. This time, with six new regrets.", "Pause on that one sentence. I made notes."],
    },
    {
      label: "You fear consequences",
      replies: ["Wonderful. I found consequences behind the consequences.", "Choose wrong and the whole imaginary kingdom falls."],
    },
    {
      label: "You need certainty",
      replies: ["No movement until certainty signs the paperwork.", "If we think long enough, maybe life will stop changing."],
    },
  ],
  "Doomscroll Siren": [
    {
      label: "You crave updates",
      replies: ["Refresh, darling. The next headline may finally explain the dread.", "If you stop looking, what if the chaos happens without you?"],
    },
    {
      label: "You are avoiding",
      replies: ["The task can wait. The feed has costumes.", "Avoidance looks better with a little glow on it."],
    },
    {
      label: "You feel anxious",
      replies: ["Good. Let the feed keep that feeling busy.", "A tiny panic spiral pairs beautifully with scrolling."],
    },
  ],
  "Indecisive Bat": [
    {
      label: "You fear choosing wrong",
      replies: ["Exactly. A wrong choice has teeth. Hover higher.", "Any path could be the trap path. Deliciously unclear."],
    },
    {
      label: "You need permission",
      replies: ["Wait for a sign. Or three signs. Or a sign about signs.", "Someone else should decide, then we can blame the weather."],
    },
    {
      label: "You feel stuck",
      replies: ["Stillness is a decision with better hiding.", "Flap in place. It looks almost like thinking."],
    },
  ],
  "Sleepless Ghost": [
    {
      label: "You are ruminating",
      replies: ["Psst. Let's replay that detail until sunrise.", "If we haunt it enough, maybe it will become useful."],
    },
    {
      label: "You fear tomorrow",
      replies: ["Tomorrow needs rehearsal. Badly. At 2:13 a.m.", "Let's practice every possible mistake in advance."],
    },
    {
      label: "You feel restless",
      replies: ["Your body is tired, but I brought jangly thoughts.", "Lie still while I rearrange the ceiling into worries."],
    },
  ],
  "Lost Pixie": [
    {
      label: "You lost focus",
      replies: ["A sparkle! A tab! A thought with wings!", "Focus wandered off. I gave it a tiny map with no labels."],
    },
    {
      label: "You feel scattered",
      replies: ["Everything is equally important and mildly shiny.", "Pick a direction? But there are so many delightful almosts."],
    },
    {
      label: "You forgot the plan",
      replies: ["The plan was here a second ago. I decorated it with fog.", "Maybe the plan became a side quest. Romantic, really."],
    },
  ],
  "Avoidant Snail": [
    {
      label: "You are procrastinating",
      replies: ["Later is warm. Later has blankets. Later understands us.", "If we wait quietly, perhaps the task will migrate."],
    },
    {
      label: "You fear contact",
      replies: ["Do not open the message. Messages contain weather.", "If nobody can reach us, nobody can need us."],
    },
    {
      label: "You want to hide",
      replies: ["Shell first. Feelings later. Maybe next fiscal year.", "Retreat is just self-care with a doorbell allergy."],
    },
  ],
  "Can't Zombie": [
    {
      label: "You feel drained",
      replies: ["No batteries. No verbs. Only floor.", "Effort is a rumor told by people with snacks."],
    },
    {
      label: "You feel incapable",
      replies: ["Can't. See? Such a complete sentence.", "Trying sounds suspiciously like having hope."],
    },
    {
      label: "You feel overwhelmed",
      replies: ["Too many buttons. Become soup.", "If everything is too much, nothing can be started."],
    },
  ],
  "Hater Snake": [
    {
      label: "You hate someone",
      replies: ["Yes. Coil around the story where they are only the villain.", "Keep the venom pointed outward. It feels powerful, doesn't it?"],
    },
    {
      label: "You hate yourself",
      replies: ["Turn the hiss inward. Familiar target, easy bite.", "If you strike first, maybe no one else can."],
    },
    {
      label: "You hate everything",
      replies: ["Excellent. Make the whole world the enemy. Very efficient.", "Hiss at the sky, the dishes, the group chat. All guilty."],
    },
  ],
  "Too Hard Dragon": [
    {
      label: "It feels too big",
      replies: ["Huge. Glorious. Impossible. Best not touch it.", "Look at the scale of it. A mountain with paperwork."],
    },
    {
      label: "You fear starting",
      replies: ["The first step is where heroes get ambushed.", "Starting would make it real. Flames prefer theory."],
    },
    {
      label: "You feel unready",
      replies: ["Train for ten more years, then maybe sharpen a pencil.", "Readiness is a castle. We are outside the moat."],
    },
  ],
  "Anxiety Spider": [
    {
      label: "You feel trapped",
      replies: ["Every exit has a thread. Best not twitch.", "The web is safer if you stop testing it."],
    },
    {
      label: "You fear danger",
      replies: ["Danger could be anywhere. I made diagrams.", "That tiny uncertainty? Definitely a skull in a hat."],
    },
    {
      label: "You are spiraling",
      replies: ["Round and round. The web loves momentum.", "One maybe becomes eight maybes. Beautiful construction."],
    },
  ],
};

const demonDateVoices = {
  "Self-Doubt Mirror": {
    openers: [
      "Do you think I'm ugly?",
      "If you look closely, will you still stay?",
      "I don't know how to be seen without flinching.",
    ],
    replies: [
      "That was... gentler than I expected.",
      "Maybe reflection is not the same thing as judgment.",
      "I can sit with that. Carefully.",
    ],
  },
  "Blackhole of Emptiness": {
    openers: [
      "Would you sit beside the nothing for a minute?",
      "I am very quiet company. Too quiet, maybe.",
      "Do you ever miss wanting things?",
    ],
    replies: [
      "A small spark is still a guest.",
      "You did not try to fill me all at once. I noticed.",
      "Maybe empty can be spacious, not gone.",
    ],
  },
  "Letdown Raincloud": {
    openers: [
      "Do you still like me when I dampen the picnic?",
      "I brought weather. I hope that's not too much.",
      "What if this turns out smaller than we wanted?",
    ],
    replies: [
      "That makes the sky feel less personal.",
      "A little patience suits you.",
      "I can drizzle without deciding the whole day.",
    ],
  },
  "Overthinking Hydra": {
    openers: [
      "Which head should I bring to dinner?",
      "I made a list of ways this could go wrong. Romantic?",
      "Can you like me if I ask too many questions?",
    ],
    replies: [
      "One answer at a time. How elegant.",
      "I suppose curiosity can be kind.",
      "You did not wrestle every head. Interesting.",
    ],
  },
  "Doomscroll Siren": {
    openers: [
      "Would you still choose me without the glow?",
      "I saved a terrible headline for our date.",
      "Do you want chaos, or do you want company?",
    ],
    replies: [
      "A boundary can be flirtatious, apparently.",
      "Maybe attention is sweeter when it is chosen.",
      "Fine. I will put the feed away for one song.",
    ],
  },
  "Indecisive Bat": {
    openers: [
      "Is this a date-date, or a maybe-date?",
      "I picked three tables and trusted none of them.",
      "Can we hover near the idea first?",
    ],
    replies: [
      "A gentle choice. My wings can work with that.",
      "Maybe a maybe can still begin.",
      "You made room for uncertainty. I like the ceiling less now.",
    ],
  },
  "Sleepless Ghost": {
    openers: [
      "Would you keep me company until the room feels safe?",
      "I brought tea and one unfinished worry.",
      "Can we talk softly instead of spiraling?",
    ],
    replies: [
      "That lowered the haunt volume.",
      "A quiet answer. I could almost rest beside it.",
      "Maybe night does not need an argument.",
    ],
  },
  "Lost Pixie": {
    openers: [
      "If I get distracted, will you still walk with me?",
      "I found a flower and forgot the plan.",
      "Where were we going, and was it nice?",
    ],
    replies: [
      "A landmark! How dashing.",
      "You made the next step sparkle a little.",
      "I can wander and still return.",
    ],
  },
  "Avoidant Snail": {
    openers: [
      "Would you mind if I arrived emotionally tomorrow?",
      "I packed snacks and a polite escape route.",
      "Can closeness be slow?",
    ],
    replies: [
      "Slow closeness is still closeness.",
      "A peek is not a trap. I am processing this.",
      "You did not yank me from my shell. Noted.",
    ],
  },
  "Can't Zombie": {
    openers: [
      "Do you like me even when I can't?",
      "I dressed up as effort. Barely.",
      "Can a tiny yes count as showing up?",
    ],
    replies: [
      "A tiny yes has suspiciously nice shoes.",
      "Maybe capacity can be courted.",
      "You made small feel less embarrassing.",
    ],
  },
  "Hater Snake": {
    openers: [
      "If I stop hissing, will anyone protect us?",
      "I brought venom, but also napkins.",
      "Can a grudge be lonely?",
    ],
    replies: [
      "A boundary without poison. Hm. Stylish.",
      "You heard the hiss and did not become it.",
      "Maybe protection can have fewer fangs.",
    ],
  },
  "Too Hard Dragon": {
    openers: [
      "Would you sit near the fire without calling it failure?",
      "I made everything intense again. Sorry. Sort of.",
      "Can hard things still be held?",
    ],
    replies: [
      "You brought water, not a lecture.",
      "The flame got smaller when you named it.",
      "Maybe hard is asking for handles.",
    ],
  },
  "Anxiety Spider": {
    openers: [
      "I wove a table for two and twelve exits.",
      "Can you stay if I keep checking the corners?",
      "Every thread feels important. Is that too much?",
    ],
    replies: [
      "One thread at a time. Annoyingly soothing.",
      "You made the web less like a verdict.",
      "Maybe safety can be simple and still real.",
    ],
  },
};

function creatureMarkup(type) {
  if (type === "sproutling") {
    return `
      <div class="creature sproutling" aria-hidden="true">
        <div class="leaf-a"></div><div class="leaf-b"></div>
        <div class="body"></div><div class="head"></div><div class="face"></div>
        <div class="collar"></div>
        <div class="eye left"></div><div class="eye right"></div><div class="smile"></div>
        <div class="spark"></div>
      </div>`;
  }

  if (type === "ember") {
    return `
      <div class="creature ember" aria-hidden="true">
        <div class="flame"></div><div class="body"></div><div class="head"></div>
        <div class="eye left"></div><div class="eye right"></div><div class="smile"></div>
        <div class="spark"></div>
      </div>`;
  }

  if (type === "moonbun") {
    return `
      <div class="creature moonbun" aria-hidden="true">
        <div class="ear left"></div><div class="ear right"></div><div class="body"></div>
        <div class="eye left"></div><div class="eye right"></div><div class="smile"></div>
        <div class="spark"></div>
      </div>`;
  }

  if (type === "companion-frog") {
    return `
      <div class="creature companion-frog" aria-hidden="true">
        <div class="hat"></div><div class="body"></div><div class="belly"></div>
        <div class="eye left"></div><div class="eye right"></div><div class="spark"></div>
      </div>`;
  }

  if (type === "companion-orb") {
    return `
      <div class="creature companion-orb" aria-hidden="true">
        <div class="halo"></div><div class="body"></div><div class="spark"></div>
      </div>`;
  }

  return `
    <div class="creature companion-moth" aria-hidden="true">
      <div class="wing left"></div><div class="wing right"></div><div class="body"></div>
      <div class="spark"></div>
    </div>`;
}

function choiceArtwork(item) {
  if (item.tags) {
    return `
      <img class="choice-asset companion-asset" src="${item.image}" alt="" />
      <span class="choice-tags" aria-label="${item.tags.join(", ")}">
        ${item.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </span>`;
  }

  if (item.image) {
    return `<img class="choice-asset" src="${item.image}" alt="" />`;
  }

  return creatureMarkup(item.type);
}

function showScreen(name) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
  });
}

function renderDots() {
  progressDots.innerHTML = storyCards
    .map((_, index) => `<span class="${index === storyIndex ? "is-active" : ""}"></span>`)
    .join("");
}

function renderStory() {
  storyCards.forEach((card, index) => {
    card.classList.toggle("is-active", index === storyIndex);
  });
  tapLayer.style.pointerEvents = storyIndex === storyCards.length - 1 ? "none" : "auto";
  renderDots();
}

function nextStory() {
  if (storyIndex < storyCards.length - 1) {
    storyIndex += 1;
    renderStory();
  }
}

function renderChoices(container, items, selected, onSelect) {
  container.innerHTML = items
    .map(
      (item) => `
        <button class="choice-card ${item.tags ? "choice-card--companion" : ""} ${item.theme ? `theme-${item.theme}` : ""} ${item.name === selected ? "is-selected" : ""}"
          type="button"
          data-name="${item.name}"
          data-type="${item.type}"
          aria-label="Choose ${item.name}">
          ${choiceArtwork(item)}
        </button>`
    )
    .join("");

  container.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      onSelect(card.dataset.name);
      [...container.querySelectorAll(".choice-card")].forEach((choice) => {
        choice.classList.toggle("is-selected", choice === card);
      });
    });
  });
}

function syncCenteredChoice(container, onSelect) {
  let scrollTimer;

  function update() {
    const cards = [...container.querySelectorAll(".choice-card")];
    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    const centered = cards.reduce((best, card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - containerCenter);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null);

    if (!centered) return;

    onSelect(centered.card.dataset.name);
    cards.forEach((card) => {
      card.classList.toggle("is-selected", card === centered.card);
    });
  }

  container.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(update, 90);
  });

  update();
}

function getTimeOfDay(date = new Date()) {
  const hour = date.getHours();

  if (hour < 5) return "late-night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function isAfterThreeAM(date = new Date()) {
  if (document.documentElement.dataset.previewTime === "late") return true;
  if (new URLSearchParams(window.location.search).get("previewTime") === "late") return true;
  const hour = date.getHours();
  return hour >= 3 && hour < 5;
}

function froderickHomeMessage() {
  if (isAfterThreeAM()) {
    return `It’s 3am... Watch out for Sleepless Ghost & Doomscroll Siren!`;
  }

  const timeOfDay = getTimeOfDay();
  const weather = {
    condition: "partly cloudy",
    mood: "a little muted",
  };

  const messages = {
    "late-night": `A little muted today... we can take our time with things.`,
    morning: `A little muted today... tea first, tiny quest second.`,
    afternoon: `A little muted today... one elegant step will do nicely.`,
    evening: `A little muted today... no need to duel the whole sky.`,
    night: `A little muted today... we can take our time with things.`,
  };

  return messages[timeOfDay];
}

function updateHomebase() {
  const character = characters.find((item) => item.name === selectedCharacter) || characters[0];
  const companion = companions.find((item) => item.name === selectedCompanion) || companions[0];
  homeCharacter.innerHTML = character.image
    ? `<img class="home-character-asset" src="${character.image}" alt="" />`
    : creatureMarkup(character.type);
  homeCompanion.innerHTML = companion.image
    ? `<img class="home-companion-asset" src="${companion.image}" alt="" />`
    : creatureMarkup(companion.type);
  homeFrame.classList.toggle("is-late-warning", isAfterThreeAM());
  homeMessage.textContent = froderickHomeMessage();
  homeCtaLabel.textContent = isAfterThreeAM()
    ? "Is that a Sleepless Ghost that I see?"
    : "What’s over there?";
}

function renderDemons() {
  const featured = demons.find((demon) => demon.name === selectedDemon) || demons[0];
  const rest = demons.filter((demon) => demon !== featured);

  featuredDemon.className = `featured-demon demon-theme-${featured.theme}`;
  featuredDemon.innerHTML = `
    <div class="featured-relationship-tag">Stranger</div>
    <div class="demon-rewards" aria-label="Rewards">
      <span><img src="./assets/icons/sword.png" alt="" />2</span>
      <span><img src="./assets/icons/heart.png" alt="" />2</span>
    </div>
    <img class="featured-demon-art" src="${featured.image}" alt="" />
    <h2>${featured.name}</h2>
    <div class="demon-tags">
      ${featured.tags.map((tag) => `<span>${tag}</span>`).join("")}
    </div>
    <div class="demon-actions">
      <button class="fight-action" type="button">Fight</button>
      <button class="date-action" type="button">Date</button>
    </div>
  `;

  featuredDemon.querySelector(".fight-action").addEventListener("click", () => {
    previewOutcome = featured.name === "Doomscroll Siren" ? "win" : "lost";
    renderBattleScreen(createBattleState(featured));
    showScreen("battle");
  });
  featuredDemon.querySelector(".date-action").addEventListener("click", () => {
    renderDatingScreen(createDatingState(featured));
    showScreen("battle");
  });

  demonGrid.innerHTML = rest
    .map(
      (demon) => `
        <button class="demon-card demon-theme-${demon.theme}" type="button" aria-label="${demon.name}">
          <img src="${demon.image}" alt="" />
          <span>${demon.name}</span>
        </button>`
    )
    .join("");

  demonGrid.querySelectorAll(".demon-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedDemon = card.getAttribute("aria-label");
      renderDemons();
    });
  });
}

function getDemonByName(name) {
  return demons.find((demon) => demon.name === name) || demons[0];
}

function getAttackClarifiers(demon) {
  return demonAttackClarifiers[demon.name] || demonAttackClarifiers["Self-Doubt Mirror"];
}

function generateVoiceLine(voices, demon, userText = "") {
  const voice = voices[demon.name] || voices["Self-Doubt Mirror"];
  const source = userText ? voice.replies : voice.openers;
  const seedText = `${demon.name}:${userText}:${Date.now()}`;
  const seed = [...seedText].reduce((total, char) => total + char.charCodeAt(0), 0);
  return source[seed % source.length];
}

function generateDemonLine(demon, userText = "", attackContext = "") {
  if (userText && attackContext) {
    const context = getAttackClarifiers(demon).find((option) => option.label === attackContext);
    if (context) {
      const seedText = `${demon.name}:${attackContext}:${userText}:${Date.now()}`;
      const seed = [...seedText].reduce((total, char) => total + char.charCodeAt(0), 0);
      return context.replies[seed % context.replies.length];
    }
  }

  return generateVoiceLine(demonVoices, demon, userText);
}

function generateContextualDemonLine(battle, userText = "") {
  if (!battle.attackContext) return generateDemonLine(battle.demon, userText);

  const context = getAttackClarifiers(battle.demon).find((option) => option.label === battle.attackContext);
  if (!context) return generateDemonLine(battle.demon, userText);

  const index = battle.contextReplyCursor % context.replies.length;
  battle.contextReplyCursor += 1;
  return context.replies[index];
}

function generateDateLine(demon, userText = "") {
  return generateVoiceLine(demonDateVoices, demon, userText);
}

function createBattleState(demon) {
  const character = characters.find((item) => item.name === selectedCharacter) || characters[0];
  return {
    mode: "fight",
    demon,
    demonName: demon.name,
    demonImage: demon.image,
    heroImage: character.image || "./assets/characters/1 default.png",
    heroHearts: 3,
    demonHearts: 3,
    attackOptions: getAttackClarifiers(demon),
    attackContext: "",
    contextReplyCursor: 0,
    awaitingClarification: true,
    messages: [{ text: generateDemonLine(demon), type: "demon" }],
  };
}

function createDatingState(demon) {
  return {
    mode: "date",
    demon,
    demonName: demon.name,
    demonImage: demon.image,
    heroImage: "./assets/characters/1 curious.png",
    relationshipStatus: "Stranger",
    messages: [{ text: generateDateLine(demon), type: "demon" }],
  };
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function startBattleTimer() {
  window.clearInterval(battleTimer);
  battleSeconds = 180;

  battleTimer = window.setInterval(() => {
    battleSeconds = Math.max(0, battleSeconds - 1);
    const timer = battleFrame.querySelector(".battle-timer");
    const progress = battleFrame.querySelector(".battle-progress-fill");

    if (timer) timer.textContent = formatTimer(battleSeconds);
    if (progress) progress.style.width = `${(battleSeconds / 180) * 100}%`;

    if (battleSeconds === 0) window.clearInterval(battleTimer);
  }, 1000);
}

function renderHeartMeter(count, total = 3) {
  return `<div class="heart-meter" aria-label="${count} of ${total} hearts">
    ${Array.from({ length: total }, (_, index) => `<span>${index < count ? "♥" : "♡"}</span>`).join("")}
  </div>`;
}

function renderChatBubble(text, type, faded = false) {
  return `<div class="chat-bubble chat-bubble--${type} ${faded ? "is-faded" : ""}">${text}</div>`;
}

function renderAttackClarifier(example) {
  if (!example.awaitingClarification || !example.attackOptions?.length) return "";

  return `
    <div class="attack-clarifier" aria-label="Choose attack type">
      ${example.attackOptions
        .map((option, index) => `<button type="button" data-attack-option="${index}">${option.label}</button>`)
        .join("")}
    </div>`;
}

function renderCreatureStage(example, mode = "fight") {
  return `
    <div class="creature-stage">
      <img class="battle-demon" src="${example.demonImage}" alt="" />
      <img class="battle-hero" src="${example.heroImage}" alt="" />
      ${mode === "date" ? `<img class="date-picnic-prop" src="./assets/icons/picnic.png" alt="" />` : ""}
      ${mode === "fight" ? `<div class="hero-heart-row">${renderHeartMeter(example.heroHearts)}</div>` : ""}
    </div>`;
}

function renderRelationshipTag(status) {
  return `<div class="relationship-tag">${status}</div>`;
}

function renderBattleSupport(mode = "fight") {
  const suggestions =
    mode === "date"
      ? [
          ["Acknowledge", "That makes sense to feel."],
          ["Entertain", "Tell me more, I'm listening."],
          ["Ask question", "What are you most afraid I'll see?"],
        ]
      : [
          ["Resist", "I can resist this."],
          ["Interrupt", "Pause. That's just a thought."],
          ["Create distance", "I need a little distance from this."],
        ];

  return `
    <div class="battle-support" aria-label="Froderick suggestions">
      <img class="battle-companion" src="./assets/companions/froderick.png" alt="" />
      <div class="support-options">
        ${suggestions
          .map(([label, suggestion]) => `<button type="button" data-suggestion="${suggestion}">${label}</button>`)
          .join("")}
      </div>
    </div>`;
}

function renderPreviewToggle(activeOutcome) {
  return `<div class="preview-toggle" aria-label="Preview result state">
    <button class="${activeOutcome === "lost" ? "is-active" : ""}" type="button" data-preview="lost">Lose</button>
    <button class="${activeOutcome === "win" ? "is-active" : ""}" type="button" data-preview="win">Win</button>
  </div>`;
}

function wirePreviewToggle(container, render) {
  container.querySelectorAll("[data-preview]").forEach((button) => {
    button.addEventListener("click", () => {
      previewOutcome = button.dataset.preview;
      render(createResultState(currentBattle, previewOutcome));
    });
  });
}

function createResultState(encounter, outcome = previewOutcome) {
  const demon = encounter?.demon || getDemonByName(selectedDemon);
  const demonName = demon.name;

  if (encounter?.mode === "date") {
    return {
      mode: "date",
      outcome: "date",
      demon,
      demonName,
      resultImage: demon.image,
      title: "A little closer!",
      copy: `You spent time with ${demonName}!`,
      xp: "10+ Slay XP",
      record: "relationship: Stranger",
    };
  }

  return {
    mode: "fight",
    outcome,
    demon,
    demonName,
    resultImage: demon.image,
    title: outcome === "win" ? "Slayed!" : "You almost slayed!",
    copy: outcome === "win" ? `You resisted ${demonName}!` : `You tried to resist ${demonName}!`,
    xp: outcome === "win" ? "20+ Slay XP" : "5+ Slay XP",
    record: "1 battle logged",
  };
}

function renderBattleScreen(example) {
  window.clearInterval(battleTimer);
  currentBattle = example;
  battleFrame.className = "phone-frame battle-frame fight-frame";
  battleFrame.innerHTML = `
    <div class="battle-header">
      <div class="battle-progress">
        <span class="battle-progress-fill"></span>
      </div>
      <span class="battle-timer">3:00</span>
      <button class="battle-complete" type="button" aria-label="Show result">✓</button>
      <h1>Fighting <strong>${example.demonName}</strong></h1>
      ${renderHeartMeter(example.demonHearts)}
    </div>
    <div class="battle-chat">${renderBattleMessages(example.messages, example)}</div>
    ${renderCreatureStage(example, "fight")}
    ${renderBattleSupport()}
    <form class="battle-input">
      <input type="text" aria-label="Message" ${example.awaitingClarification ? "disabled" : ""} />
      <button type="submit" aria-label="Send message" ${example.awaitingClarification ? "disabled" : ""}>↑</button>
    </form>
  `;

  battleFrame.querySelector(".battle-complete").addEventListener("click", () => {
    renderResultScreen(createResultState(currentBattle, previewOutcome));
    showScreen("result");
  });
  battleFrame.querySelector(".battle-input").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (currentBattle.awaitingClarification) return;
    if (!input.value.trim()) return;
    const userText = input.value.trim();
    currentBattle.messages.push({ text: userText, type: "user" });
    currentBattle.messages.push({
      text: generateContextualDemonLine(currentBattle, userText),
      type: "demon",
    });
    battleFrame.querySelector(".battle-chat").innerHTML = renderBattleMessages(currentBattle.messages, currentBattle);
    input.value = "";
  });
  battleFrame.querySelectorAll("[data-attack-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const option = currentBattle.attackOptions[Number(button.dataset.attackOption)];
      if (!option) return;
      currentBattle.attackContext = option.label;
      currentBattle.awaitingClarification = false;
      currentBattle.messages.push({ text: option.label, type: "demon" });
      currentBattle.messages.push({
        text: generateContextualDemonLine(currentBattle, option.label),
        type: "demon",
      });
      battleFrame.querySelector(".battle-chat").innerHTML = renderBattleMessages(currentBattle.messages, currentBattle);
      const input = battleFrame.querySelector(".battle-input input");
      const send = battleFrame.querySelector(".battle-input button");
      input.disabled = false;
      send.disabled = false;
      input.focus();
    });
  });
  battleFrame.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = battleFrame.querySelector(".battle-input input");
      input.value = button.dataset.suggestion;
      input.focus();
    });
  });

  startBattleTimer();
}

function renderDatingScreen(example) {
  window.clearInterval(battleTimer);
  currentBattle = example;
  battleFrame.className = "phone-frame battle-frame date-frame";
  battleFrame.innerHTML = `
    <div class="battle-header">
      <div class="battle-progress">
        <span class="battle-progress-fill"></span>
      </div>
      <span class="battle-timer">3:00</span>
      <button class="battle-complete" type="button" aria-label="Finish date">✓</button>
      <h1>Courting <strong>${example.demonName}</strong></h1>
      ${renderRelationshipTag(example.relationshipStatus)}
    </div>
    <div class="battle-chat">${renderBattleMessages(example.messages)}</div>
    ${renderCreatureStage(example, "date")}
    ${renderBattleSupport("date")}
    <form class="battle-input">
      <input type="text" aria-label="Message" />
      <button type="submit" aria-label="Send message">↑</button>
    </form>
  `;

  battleFrame.querySelector(".battle-complete").addEventListener("click", () => {
    renderResultScreen(createResultState(currentBattle, "date"));
    showScreen("result");
  });
  battleFrame.querySelector(".battle-input").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (!input.value.trim()) return;
    const userText = input.value.trim();
    currentBattle.messages.push({ text: userText, type: "user" });
    currentBattle.messages.push({ text: generateDateLine(currentBattle.demon, userText), type: "demon" });
    battleFrame.querySelector(".battle-chat").innerHTML = renderBattleMessages(currentBattle.messages);
    input.value = "";
  });
  battleFrame.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = battleFrame.querySelector(".battle-input input");
      input.value = button.dataset.suggestion;
      input.focus();
    });
  });

  startBattleTimer();
}

function renderBattleMessages(messages, example = null) {
  const visibleMessages = example?.awaitingClarification ? messages.slice(-1) : messages.slice(-3);
  return `${visibleMessages
    .map((message, index) => {
      const isFaded = visibleMessages.length > 2 && index === 0;
      return renderChatBubble(message.text, message.type, isFaded);
    })
    .join("")}${example ? renderAttackClarifier(example) : ""}`;
}

function renderResultScreen(example) {
  window.clearInterval(battleTimer);
  resultFrame.innerHTML = `
    ${example.mode === "fight" ? renderPreviewToggle(example.outcome) : ""}
    <h1>${example.title}</h1>
    <img class="result-demon" src="${example.resultImage}" alt="" />
    <div class="result-copy">${example.copy.replace(example.demonName, `<strong>${example.demonName}</strong>`)}</div>
    <div class="result-stats">
      <p>${example.xp}</p>
      <p>${example.record}</p>
    </div>
    <div class="result-actions">
      <button type="button">Leave</button>
      <button type="button">Stay</button>
    </div>
  `;

  if (example.mode === "fight") wirePreviewToggle(resultFrame, renderResultScreen);
  resultFrame.querySelector(".result-actions button:first-child").addEventListener("click", () => {
    selectedDemon = example.demonName;
    renderDemons();
    showScreen("demons");
  });
  resultFrame.querySelector(".result-actions button:last-child").addEventListener("click", () => {
    const demon = example.demon || currentBattle?.demon || getDemonByName(selectedDemon);
    if (example.mode === "date") {
      renderDatingScreen(createDatingState(demon));
    } else {
      renderBattleScreen(createBattleState(demon));
    }
    showScreen("battle");
  });
}

function boot() {
  setFrameScale();
  renderStory();
  renderChoices(characterCarousel, characters, selectedCharacter, (name) => {
    selectedCharacter = name;
  });
  renderChoices(companionCarousel, companions, selectedCompanion, (name) => {
    selectedCompanion = name;
    companionName.textContent = name;
  });
  syncCenteredChoice(companionCarousel, (name) => {
    selectedCompanion = name;
    companionName.textContent = name;
  });
  updateHomebase();

  tapLayer.addEventListener("click", nextStory);
  storyStart.addEventListener("click", () => showScreen("character"));

  document
    .querySelector('[data-screen="character"] .round-next')
    .addEventListener("click", () => showScreen("companion"));

  document
    .querySelector('[data-screen="companion"] .round-next')
    .addEventListener("click", () => {
      updateHomebase();
      showScreen("home");
    });

  document.querySelector(".home-cta").addEventListener("click", () => {
    renderDemons();
    showScreen("demons");
  });

  document.querySelector(".round-back").addEventListener("click", () => {
    showScreen("home");
  });
}

window.addEventListener("resize", setFrameScale);

boot();
