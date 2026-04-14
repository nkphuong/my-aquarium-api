import { Injectable } from '@nestjs/common';
import { TopicCheckResult } from '../types/context.types';

@Injectable()
export class ChatGuardrailEngine {
  private readonly blockedPatterns: RegExp[] = [
    /\b(politic|election|vote|president|parliament|democrat|republican|liberal|conservative)\b/i,
    /\b(stock\s*market|crypto|bitcoin|invest|forex|trading|finance|mortgage|tax\s*return)\b/i,
    /\b(dating|relationship|love\s*life|boyfriend|girlfriend|marriage\s*advice|divorce)\b/i,
    /\b(religion|pray|church|mosque|temple|god\s+is|bible|quran|scripture)\b/i,
    /\b(write\s+me\s+a\s+story|write\s+an?\s+essay|homework|math\s+problem)\b/i,
  ];

  private readonly aquariumKeywords: RegExp =
    /\b(fish|tank|aquarium|water|filter|plant|algae|shrimp|snail|coral|reef|freshwater|saltwater|brackish|ph|ammonia|nitrite|nitrate|cycle|cycling|bacteria|bioload|heater|light|substrate|gravel|sand|feed|food|disease|medication|dose|quarantine|breed|fry|egg|species|tetra|guppy|betta|goldfish|cichlid|catfish|pleco|cory|rasbora|barb|angel|discus|clown|anemone|aquascape|co2|fertilizer|trim|prune|driftwood|rock|cave|sponge|canister|hang|hob|sump|protein\s*skimmer|wave\s*maker|air\s*pump|thermometer|test\s*kit|parameter|maintenance|water\s*change|siphon|gravel\s*vac|inhabitant|livestock|stocking|compatible|temperament|aggressive|peaceful|schooling|shoal)\b/i;

  isTopicAllowed(message: string): TopicCheckResult {
    const hasBlockedContent = this.blockedPatterns.some((pattern) =>
      pattern.test(message),
    );

    // If message contains aquarium-related terms, allow it even if it
    // accidentally matches a blocked pattern (e.g., "fish tank investment")
    const hasAquariumContent = this.aquariumKeywords.test(message);

    if (hasBlockedContent && !hasAquariumContent) {
      return {
        allowed: false,
        redirectMessage: this.getRedirectMessage(),
      };
    }

    return { allowed: true };
  }

  getRedirectMessage(): string {
    return (
      "I'm Finley, your aquarium buddy! I'm best at helping with fish, " +
      'tanks, water chemistry, and everything aquarium-related. ' +
      'Feel free to ask me anything about your aquatic friends! 🐠'
    );
  }
}
