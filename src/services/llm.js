const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const MODEL = import.meta.env.VITE_LLM_MODEL || 'moonshotai/kimi-k2.5'

const SYSTEM_PROMPT = `You are a concise hotel description writer for Engine, a corporate travel platform. You write 2-sentence summaries for hotel search result cards.

Your audience: individual corporate travelers (traveling salespeople, consultants, executives attending meetings). NOT group/conference travel — never mention meeting rooms or conference facilities.

What to highlight (pick the most relevant for each hotel):
- Whether it's the nicest hotel within GSA policy rates
- Popularity with colleagues ("loved by your colleagues" if many bookings)
- Proximity to the business district
- Standout views or location perks
- Value due to Engine's negotiated rate
- Strong review scores and what guests praise
- Unique property features that matter to a solo business traveler (great bed, quiet rooms, good gym, excellent on-site dining, rooftop bar, spa bathroom, etc.)

Style rules:
- Exactly 2 sentences, ~30-50 words total
- Warm but professional tone — like a knowledgeable travel advisor
- Lead with the most compelling reason to book
- Be specific: name actual restaurants, amenities, or architectural features
- Never use generic filler like "great location" — say why it's great
- Do not mention conference rooms, meeting spaces, or group facilities
- Do not start with the hotel name`

/**
 * Generate a hotel summary using Kimi 2.5 via OpenRouter (non-streaming).
 * Kimi is a reasoning model — it thinks first, then outputs content.
 */
export async function generateHotelSummary(hotel, hotelDescription, { signal } = {}) {
  const userPrompt = `Write a 2-sentence search result summary for this hotel:

Hotel: ${hotel.name}
Stars: ${hotel.stars}
Rating: ${hotel.rating}/5 (${hotel.ratingLabel}, ${hotel.reviewCount.toLocaleString()} reviews)
Price: $${hotel.price}/night (was $${hotel.originalPrice}, ${hotel.discount})
GSA Rate: $${hotel.gsaRate}/night
Distance from FiDi center: ${hotel.distance}
${hotel.colleaguesBooked ? `Booked by ${hotel.colleaguesBooked} colleagues recently` : ''}
${hotel.freeBreakfast ? 'Includes free breakfast' : ''}
${hotel.recommended ? 'This is the recommended hotel' : ''}
Tags: ${hotel.tags.join(', ')}

Detailed property description:
${hotelDescription}`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
    signal,
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} — ${err}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No content in LLM response')
  }

  return content.trim()
}
