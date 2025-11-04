import type { ChecklistData } from '../types';
import { f2pQuests } from './quests/f2pQuests';
import { f2pCollectionLogItems } from './f2pCollectionLog';

export const f2pChecklistData: ChecklistData = [
  {
    id: 'f2p_skills',
    title: 'Skills (Level 99)',
    iconUrl: 'https://oldschool.runescape.wiki/images/Stats_icon.png?1b467',
    items: [
      { id: 'f2p_skill_attack', label: 'Attack' },
      { id: 'f2p_skill_strength', label: 'Strength' },
      { id: 'f2p_skill_defence', label: 'Defence' },
      { id: 'f2p_skill_hitpoints', label: 'Hitpoints' },
      { id: 'f2p_skill_ranged', label: 'Ranged' },
      { id: 'f2p_skill_prayer', label: 'Prayer' },
      { id: 'f2p_skill_magic', label: 'Magic' },
      { id: 'f2p_skill_cooking', label: 'Cooking' },
      { id: 'f2p_skill_woodcutting', label: 'Woodcutting' },
      { id: 'f2p_skill_fletching', label: 'Fletching' },
      { id: 'f2p_skill_fishing', label: 'Fishing' },
      { id: 'f2p_skill_firemaking', label: 'Firemaking' },
      { id: 'f2p_skill_crafting', label: 'Crafting' },
      { id: 'f2p_skill_smithing', label: 'Smithing' },
      { id: 'f2p_skill_mining', label: 'Mining' },
      { id: 'f2p_skill_runecrafting', label: 'Runecrafting' },
    ],
  },
  {
    id: 'f2p_quests',
    title: 'All Quests',
    iconUrl: 'https://oldschool.runescape.wiki/images/Quest_point_cape_detail.png?b464a',
    items: [
      { id: 'quests_header_f2p', label: 'Free-to-Play Quests', isHeader: true },
      ...f2pQuests,
    ],
  },
  {
    id: 'f2p_gear',
    title: 'Best In Slot Gear',
    iconUrl: 'https://oldschool.runescape.wiki/images/Rune_platebody_detail.png?e01a8',
    items: [
      { id: 'f2p_gear_rune_scimitar', label: 'Rune Scimitar' },
      { id: 'f2p_gear_rune_full_helm', label: 'Rune Full Helm' },
      { id: 'f2p_gear_rune_platebody', label: 'Rune Platebody' },
      { id: 'f2p_gear_rune_platelegs', label: 'Rune Platelegs' },
      { id: 'f2p_gear_rune_kiteshield', label: 'Rune Kiteshield' },
      { id: 'f2p_gear_fancy_boots', label: 'Fancy Boots' },
      { id: 'f2p_gear_fighting_boots', label: 'Fighting Boots' },
      { id: 'f2p_gear_amulet_of_power', label: 'Amulet of Power' },
      { id: 'f2p_gear_maple_shortbow', label: 'Maple Shortbow (i)' },
      { id: 'f2p_gear_green_dhide_body', label: 'Green d\'hide Body' },
      { id: 'f2p_gear_green_dhide_chaps', label: 'Green d\'hide Chaps' },
      { id: 'f2p_gear_coif', label: 'Coif' },
      { id: 'f2p_gear_wizard_hat', label: 'Wizard Hat' },
      { id: 'f2p_gear_zamorak_robe', label: 'Zamorak Robes' },
    ]
  },
  {
    id: 'f2p_collection_log',
    title: 'Collection Log',
    iconUrl: 'https://oldschool.runescape.wiki/images/Collection_log_detail.png',
    items: f2pCollectionLogItems
  }
];