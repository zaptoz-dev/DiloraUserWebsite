# Voice bot action items: design notes

Companion to the consolidated action-item list. This repo is the marketing site
plus its demo server, so items that need product backend work or new audio
recordings are specified here rather than implemented.

## 1. Two enquiry types on the same phone number

### Model

- **Contact**: one per phone number, keyed on the E.164 form produced by
  `shared/phone.js`. "98201 xxxxx", "+91 98201 xxxxx" and "098201 xxxxx" must
  resolve to the same contact.
- **Lead**: one per contact (Auto Lead Creation creates it on the first call).
- **Enquiry**: many per contact. Keyed on `(contact, enquiry_type)`, each with its
  own status, disposition, owner and follow-up date.

Different enquiry types never share a record, so one can never overwrite the other.

### Flow for every call (inbound, outbound or batch)

1. Normalise the number and look up the contact and its open enquiries.
2. Classify the caller's intent from the conversation (for example: loan, insurance,
   appointment, order status). A single call can yield more than one intent.
3. For each intent:
   - An **open enquiry of the same type** exists: update it (add the call, refresh
     the disposition). Do not create a duplicate.
   - **No open enquiry of that type**: create a new enquiry under the same lead.
   - A **closed enquiry of the same type** exists: reopen it if closed within the
     reopen window, otherwise create a new one.
4. If the intent is ambiguous, the bot asks one clarifying question
   ("Is this about your loan, or your insurance policy?") before writing anything.
5. When the contact has open enquiries of several types, the bot opens by naming
   them ("I'm calling about your loan enquiry") and lets the caller redirect.

### Conflict rules

- A unique constraint on `(contact_id, enquiry_type)` where status is open prevents
  duplicate open enquiries under concurrent calls. A losing writer retries as an update.
- **Parallel and batch calling**: take a per-number lock before dialling. If the same
  number appears in a batch under two enquiry types, place one call that covers both
  and record an outcome for each. Never ring the same person twice at once.
- Per-number call frequency limits apply to the contact, not to each enquiry.
- A transcript and recording belong to the call. Each enquiry stores a pointer to the
  call plus its own summary and disposition.

### Acceptance checks

- Two enquiries of different types from one number produce two enquiries and one lead.
- Two enquiries of the same type produce one enquiry with two calls.
- Two simultaneous calls for different types both succeed with no lost update.
- A batch containing one number twice dials it once.

Status: specified. Implementation belongs to the product backend (lead and call
storage), which is not part of this repository.

## 2. Language evaluation

Findings from provider documentation, checked 3 Nov 2026. None of this has been
tested with this account's credentials.

| Language | Speech to text (Deepgram nova-3, `multi`, 55 languages) | Text to speech |
| --- | --- | --- |
| Hindi, English | Measured working in `server/voice/config.js` | Sarvam bulbul v3 and ElevenLabs |
| Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Malayalam | Verify on the account | Sarvam bulbul v3 (10 Indian languages plus English) and ElevenLabs |
| Assamese | Added to nova-3 in Aug 2026 | Not in Sarvam bulbul v3. ElevenLabs Eleven v3 lists Assamese |
| Arabic | Verify on the account | ElevenLabs Eleven v3 and Multilingual v2 |
| Urdu | Verify on the account | ElevenLabs Eleven v3 |
| Vietnamese | Verify on the account | ElevenLabs Eleven v3 |
| Thai | Verify on the account | ElevenLabs Eleven v3 |
| Mandarin (Singapore) | Verify on the account | ElevenLabs Eleven v3 |
| Malay (Bahasa Malaysia) | Verify on the account | ElevenLabs Multilingual v2 |
| Filipino | Verify on the account | ElevenLabs Multilingual v2 |

Singapore-relevant languages are English, Mandarin, Malay and Tamil. English, Malay
and Tamil are already in the list; Mandarin is added.

The server currently uses `eleven_v4_turbo` and Sarvam as fallback. Sarvam cannot
voice Arabic, Urdu or the South-East Asian languages, so the fallback chain
(`VOICE_TTS_CHAIN`) will drop to Polly for those. Check that Polly covers each one
before enabling live conversations.

On the Voice Lab page the new languages show "Coming soon" until real sample clips
are recorded and added to `public/audio/`.

Sources:
[Sarvam languages](https://docs.sarvam.ai/api-reference-docs/api-guides-tutorials/text-to-speech/how-to/set-the-language),
[Deepgram nova-3 multilingual](https://developers.deepgram.com/docs/nova-3-language-prompting),
[Deepgram changelog, Aug 2026](https://developers.deepgram.com/changelog/2026/8/27),
[ElevenLabs languages](https://elevenlabs.io/docs/help-center/other/what-languages-do-you-support).
Content was rephrased for compliance with licensing restrictions.

## 3. Voice samples that need new recordings

The Voice Lab plays fixed files from `public/audio/`. They cannot be changed in code.

| Item | What to do |
| --- | --- |
| Hindi female too slow | Regenerate `Hindi_female.mp3` with a faster pace (for example Sarvam `pace` about 1.1 to 1.2) and listen before replacing |
| Kannada female quality and pronunciation | Regenerate `Kannada_female.mp3` with a different speaker, or fix the text the clip was generated from; review with a native speaker |
| Marathi male | Audition other `mr-IN` speakers and replace `Marathi_male.mp3` |
| New languages | Record female and male clips, then add an `audio` entry to each language in `src/pages/VoiceLab.tsx` |
