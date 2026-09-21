/**
 * Emoji catalogue for the "any emoji" side of the reaction picker.
 *
 * Hand-curated rather than pulled from a full Unicode set: the quick row stays
 * the curated platform set, and this is the escape hatch behind it. A complete
 * catalogue would be ~1800 entries and a dependency; a few hundred covers what
 * people actually reach for without either.
 *
 * Keywords exist because the glyph is unsearchable — "party" has to find 🎉.
 */

export type EmojiGroup = {
  name: string;
  /** `[emoji, space-separated search keywords]`. */
  emoji: readonly (readonly [string, string])[];
};

export const EMOJI_GROUPS: readonly EmojiGroup[] = [
  {
    name: 'Reactions',
    emoji: [
      ['❤️', 'heart love red'],
      ['🧡', 'heart orange love'],
      ['💛', 'heart yellow love'],
      ['💚', 'heart green love'],
      ['💙', 'heart blue love'],
      ['💜', 'heart purple love'],
      ['🤍', 'heart white love'],
      ['💖', 'heart sparkle love'],
      ['👍', 'thumbs up yes agree like ok'],
      ['👏', 'clap applause bravo well done'],
      ['🙌', 'hands raised celebrate praise'],
      ['🙋', 'hand raised volunteer me question'],
      ['🤝', 'handshake deal agree partner'],
      ['🙏', 'pray thanks please grateful'],
      ['💪', 'muscle strong effort'],
      ['✊', 'fist solidarity support'],
      ['👋', 'wave hello hi welcome'],
      ['🫶', 'heart hands love care'],
      ['🤙', 'call me shaka nice'],
      ['✌️', 'peace victory'],
    ],
  },
  {
    name: 'Smileys',
    emoji: [
      ['😀', 'grin happy smile'],
      ['😄', 'happy smile joy'],
      ['😁', 'beam grin happy'],
      ['😊', 'blush smile warm'],
      ['🙂', 'slight smile'],
      ['😉', 'wink'],
      ['😍', 'heart eyes love adore'],
      ['🥰', 'love hearts affection'],
      ['😘', 'kiss love'],
      ['🤗', 'hug care'],
      ['🤩', 'star struck amazed wow'],
      ['😎', 'cool sunglasses'],
      ['🤓', 'nerd glasses study'],
      ['🧐', 'monocle inspect curious'],
      ['🤔', 'think hmm wonder question'],
      ['🤨', 'raised eyebrow doubt skeptical'],
      ['😅', 'sweat smile relief awkward'],
      ['😂', 'laugh tears funny lol'],
      ['🤣', 'rofl laughing funny'],
      ['😇', 'angel innocent halo'],
      ['🙃', 'upside down irony'],
      ['😴', 'sleep tired zzz'],
      ['🥱', 'yawn bored tired'],
      ['😬', 'grimace awkward yikes'],
      ['😮', 'surprised wow open mouth'],
      ['😲', 'astonished shock wow'],
      ['🤯', 'mind blown exploding head wow'],
      ['😳', 'flushed surprise embarrassed'],
      ['🥺', 'pleading please puppy eyes'],
      ['😢', 'sad cry tear'],
      ['😭', 'sob cry sad'],
      ['😤', 'determined huff frustrated'],
      ['😱', 'scream fear shock'],
      ['🤐', 'zipper mouth quiet secret'],
      ['🤫', 'shush quiet secret'],
      ['😶', 'no mouth speechless'],
      ['🫠', 'melting overwhelmed'],
      ['🫡', 'salute understood yes sir'],
      ['🤷', 'shrug dunno unsure'],
      ['🤦', 'facepalm oops'],
    ],
  },
  {
    name: 'Ideas & work',
    emoji: [
      ['💡', 'idea lightbulb insight'],
      ['🎯', 'target goal bullseye focus'],
      ['✅', 'check done complete yes'],
      ['☑️', 'checkbox done ticked'],
      ['❌', 'cross no wrong'],
      ['⚠️', 'warning caution careful'],
      ['❓', 'question ask unclear'],
      ['❗', 'exclamation important'],
      ['🚀', 'rocket launch ship fast'],
      ['🔥', 'fire hot great lit'],
      ['⭐', 'star favourite quality'],
      ['✨', 'sparkles shiny new magic'],
      ['🏆', 'trophy win award best'],
      ['🥇', 'gold medal first win'],
      ['🎉', 'party celebrate congrats tada'],
      ['🎊', 'confetti celebrate party'],
      ['📌', 'pin important remember'],
      ['📍', 'location place pin'],
      ['📝', 'note write memo'],
      ['📊', 'chart data stats'],
      ['📈', 'chart up growth increase'],
      ['📉', 'chart down decline'],
      ['🗓️', 'calendar date schedule'],
      ['⏰', 'alarm time deadline'],
      ['⏳', 'hourglass waiting time'],
      ['🔍', 'search look magnify find'],
      ['🔗', 'link url chain'],
      ['📎', 'paperclip attach file'],
      ['📁', 'folder files'],
      ['📄', 'document page file'],
      ['🧩', 'puzzle piece fit part'],
      ['🛠️', 'tools build fix'],
      ['⚙️', 'gear settings config'],
      ['🧪', 'experiment test lab'],
      ['🧠', 'brain smart think'],
      ['💬', 'speech comment talk discuss'],
      ['📣', 'megaphone announce shout'],
      ['🗳️', 'ballot vote decide'],
      ['🤖', 'robot bot ai'],
      ['💻', 'laptop computer code'],
    ],
  },
  {
    name: 'Nature & things',
    emoji: [
      ['🌱', 'seedling grow start new'],
      ['🌳', 'tree nature green'],
      ['🌍', 'earth world globe planet'],
      ['🌊', 'wave water sea'],
      ['☀️', 'sun sunny bright'],
      ['🌈', 'rainbow hope colour'],
      ['⚡', 'lightning energy power fast'],
      ['❄️', 'snow cold winter'],
      ['🍀', 'clover luck lucky'],
      ['🌻', 'sunflower flower bright'],
      ['🌸', 'blossom flower spring'],
      ['🐝', 'bee busy work'],
      ['🦋', 'butterfly change transform'],
      ['🐢', 'turtle slow steady'],
      ['🐙', 'octopus multitask'],
      ['🍕', 'pizza food lunch'],
      ['☕', 'coffee break morning'],
      ['🍰', 'cake celebrate birthday'],
      ['🥳', 'party face celebrate birthday'],
      ['🎁', 'gift present reward'],
      ['🧭', 'compass direction navigate'],
      ['🗺️', 'map plan route'],
      ['🏗️', 'construction building wip'],
      ['🔑', 'key access unlock'],
      ['🔒', 'lock secure private'],
      ['🛟', 'life ring help support rescue'],
      ['🪴', 'plant grow care'],
      ['🕯️', 'candle calm remember'],
      ['🎨', 'art design creative paint'],
      ['🎵', 'music note sound'],
    ],
  },
];

/** Every emoji in the catalogue, flattened, in group order. */
export const ALL_EMOJI: readonly string[] = EMOJI_GROUPS.flatMap(group =>
  group.emoji.map(([emoji]) => emoji),
);

/**
 * Emoji whose keywords all match the query, in catalogue order.
 *
 * Every word in the query has to match so "green heart" narrows instead of
 * widening — matching any word turned two-word queries into a full page of
 * hearts plus everything green.
 */
export function searchEmoji(query: string): string[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...ALL_EMOJI];

  const out: string[] = [];
  for (const group of EMOJI_GROUPS) {
    for (const [emoji, keywords] of group.emoji) {
      const haystack = `${keywords} ${group.name.toLowerCase()}`;
      if (words.every(word => haystack.includes(word))) out.push(emoji);
    }
  }
  return out;
}
