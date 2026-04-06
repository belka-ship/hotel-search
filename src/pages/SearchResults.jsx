import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Leaf,
  Coffee,
  ShieldCheck,
  Sparkles,
  X,
  Users,
  AlertCircle,
  MapPin as MapPinIcon,
  CalendarDays,
} from 'lucide-react'
import { hotels } from '../data/hotels'

function HotelCard({ hotel, naturalQuery, isFirst, aiSummary }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const isRecommended = hotel.recommended

  const prevImg = (e) => {
    e.stopPropagation()
    setImgIndex((i) => (i === 0 ? hotel.images.length - 1 : i - 1))
  }
  const nextImg = (e) => {
    e.stopPropagation()
    setImgIndex((i) => (i === hotel.images.length - 1 ? 0 : i + 1))
  }

  return (
    <div
      className={`relative flex gap-4 p-4 rounded-2xl hover:shadow-md transition-shadow ${
        isRecommended
          ? 'border-2 border-emerald-400 bg-emerald-50/30 shadow-sm pt-6'
          : 'border border-gray-200'
      }`}
    >
      {/* Recommended label */}
      {isRecommended && (
        <div className="absolute -top-3 left-4 z-20 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          Recommended
        </div>
      )}

      {/* Image Carousel */}
      <div className="relative w-[240px] h-[180px] shrink-0 rounded-xl overflow-hidden group">
        <img
          src={hotel.images[imgIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 z-10"
        >
          <Heart
            size={20}
            className={liked ? 'fill-red-500 text-red-500' : 'text-white fill-white/30'}
          />
        </button>
        <button
          onClick={prevImg}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={nextImg}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={16} />
        </button>
        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {hotel.images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 flex-wrap">
                <span>{hotel.stars}-star hotel</span>
                <span className="text-gray-300">•</span>
                <Star size={13} className="text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{hotel.rating}</span>
                <span>
                  {hotel.ratingLabel} ({hotel.reviewCount.toLocaleString()})
                </span>
                <span className="text-gray-300">•</span>
                <span>{hotel.distance}</span>
              </div>
              {/* Booked by colleagues */}
              {hotel.colleaguesBooked > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Users size={12} className="text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    Booked by {hotel.colleaguesBooked} colleague{hotel.colleaguesBooked > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              {hotel.price > hotel.gsaRate && (
                <div className="flex items-center gap-1 justify-end mb-1">
                  <span className="text-xs font-medium text-red-600 border border-red-200 rounded-full px-2 py-0.5 inline-flex items-center gap-1">
                    1 policy issue
                    <AlertCircle size={12} className="text-red-400" />
                  </span>
                </div>
              )}
              <div className="text-xs text-gray-500">GSA rate: ${hotel.gsaRate}</div>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-sm text-gray-400 line-through">
                  ${hotel.originalPrice}
                </span>
                <span className="text-2xl font-bold text-gray-900">${hotel.price}</span>
              </div>
              <div className="flex gap-1.5 justify-end mt-0.5">
                <span className="text-sm text-green-700">Save ${hotel.savings}</span>
                <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">
                  {hotel.discount}
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mt-1">
            {hotel.badges.map((badge) => (
              <span key={badge} className="flex items-center gap-1 text-sm text-gray-600">
                <Leaf size={14} className="text-green-600" />
                {badge}
              </span>
            ))}
            {hotel.sponsored && (
              <span className="text-xs text-gray-400">Sponsored</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              {hotel.freeBreakfast && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Coffee size={14} className="text-orange-500" />
                  Free breakfast
                </span>
              )}
              {hotel.refundable && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <ShieldCheck size={14} className="text-green-600" />
                  Refundable
                </span>
              )}
            </div>
            {hotel.loyaltyPoints && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#1C1C1C] rounded flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold leading-none">M</span>
                </div>
                <span className="text-sm text-gray-700">{hotel.loyaltyPoints}</span>
              </div>
            )}
            {hotel.navanRewards && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">✦</span>
                </div>
                <span className="text-sm text-purple-600">{hotel.navanRewards}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">${hotel.totalPrice} total</div>
            <div className="text-xs text-gray-400">with taxes & fees</div>
            <button className="mt-1.5 bg-black text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Choose room
            </button>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-[13px] text-gray-500 leading-relaxed">
            <Sparkles
              size={12}
              className="inline text-amber-500 mr-1 -mt-0.5"
            />
            {aiSummary || (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">Writing summary</span>
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Map pin as absolutely positioned div over the map image
function MapPin({ left, top, price, isRecommended }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-full"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <div
        className={`relative px-2.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap shadow-md ${
          isRecommended
            ? 'bg-emerald-500 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        ${price}
        {/* Pointer */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rotate-45 ${
            isRecommended
              ? 'bg-emerald-500'
              : 'bg-white border-r border-b border-gray-200'
          }`}
        />
      </div>
    </div>
  )
}

const filterButtons = [
  { label: 'All filters', icon: SlidersHorizontal },
  { label: 'Sort: Recommended', icon: ArrowUpDown, hasDropdown: true },
  { label: 'Recent filters', hasDropdown: true },
  { label: 'Price', hasDropdown: true },
  { label: 'GSA or less' },
  { label: 'Star rating', hasDropdown: true },
  { label: 'Loyalty eligible', hasDropdown: true },
  { label: 'Free breakfast ava...' },
]

// Pin positions as percentages on the map image
// Calculated from lat/lng relative to map bounds, then adjusted to avoid overlaps
const pinPositions = [
  { hotelId: 1,  left: 57,   top: 25 },   // Beekman (Nassau/Beekman St)
  { hotelId: 2,  left: 53,   top: 66 },   // Wall Street Hotel (Wall St)
  { hotelId: 3,  left: 60,   top: 59 },   // Hyatt Centric (Wall St east)
  { hotelId: 4,  left: 67,   top: 46 },   // Gild Hall (Gold St)
  { hotelId: 5,  left: 55,   top: 33 },   // Moxy (Ann St)
  { hotelId: 6,  left: 73,   top: 55 },   // Courtyard (Pearl St)
  { hotelId: 7,  left: 47,   top: 40 },   // Holiday Inn (Nassau St)
  { hotelId: 8,  left: 44,   top: 76 },   // DoubleTree (Stone St south)
  { hotelId: 9,  left: 44,   top: 52 },   // Radisson (William St)
  { hotelId: 10, left: 34,   top: 30 },   // Millennium (Church St)
  { hotelId: 11, left: 60,   top: 44 },   // Four Points (Platt St)
  { hotelId: 12, left: 27,   top: 42 },   // Club Quarters (Washington St)
]

function MapView() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <img
        src="/fidi-map.png"
        alt="Financial District, New York map"
        className="w-full h-full object-cover"
      />
      {/* Hotel price pins */}
      {pinPositions.map((pin) => {
        const hotel = hotels.find((h) => h.id === pin.hotelId)
        if (!hotel) return null
        return (
          <MapPin
            key={pin.hotelId}
            left={pin.left}
            top={pin.top}
            price={hotel.price}
            isRecommended={hotel.recommended}
          />
        )
      })}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-2xl animate-pulse">
      {/* Image skeleton */}
      <div className="w-[240px] h-[180px] shrink-0 rounded-xl bg-gray-200" />
      {/* Content skeleton */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-3.5 bg-gray-100 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
          <div className="text-right">
            <div className="h-3 bg-gray-200 rounded w-16 mb-1 ml-auto" />
            <div className="h-7 bg-gray-200 rounded w-20 mb-1 ml-auto" />
            <div className="h-3 bg-gray-100 rounded w-14 mb-2 ml-auto" />
            <div className="h-9 bg-gray-800 rounded-lg w-28 ml-auto" />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="h-3 bg-gray-100 rounded w-full mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    </div>
  )
}

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
        <div className="h-3 bg-gray-200 rounded w-24 mx-auto mb-2" />
        <div className="h-2.5 bg-gray-200 rounded w-16 mx-auto" />
      </div>
    </div>
  )
}

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = 'FiDi, New York'
  const checkIn = searchParams.get('checkIn') || 'Apr 21'
  const checkOut = searchParams.get('checkOut') || 'Apr 23'
  const rooms = searchParams.get('rooms') || '1 Room, 1 Guest'
  const naturalQuery = searchParams.get('q') || ''
  const [localQuery, setLocalQuery] = useState(naturalQuery)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [editLocation, setEditLocation] = useState(location)
  const [editCheckIn, setEditCheckIn] = useState(checkIn)
  const [editCheckOut, setEditCheckOut] = useState(checkOut)
  const [editRooms, setEditRooms] = useState(rooms)
  const [editNaturalQuery, setEditNaturalQuery] = useState(naturalQuery)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [hotelsLoaded, setHotelsLoaded] = useState(false)
  const [aiSummaries, setAiSummaries] = useState({})

  useEffect(() => {
    const mapTimer = setTimeout(() => setMapLoaded(true), 2000)
    const hotelsTimer = setTimeout(() => setHotelsLoaded(true), 4000)
    return () => {
      clearTimeout(mapTimer)
      clearTimeout(hotelsTimer)
    }
  }, [])

  // Simulate AI summary generation with a 4-second delay after hotels load
  useEffect(() => {
    if (!hotelsLoaded) return
    const timer = setTimeout(() => {
      const summaries = {}
      hotels.forEach((hotel) => {
        summaries[hotel.id] = hotel.summary
      })
      setAiSummaries(summaries)
    }, 4000)
    return () => clearTimeout(timer)
  }, [hotelsLoaded])

  // Hotels render in the exact order defined in the data file. No re-sorting.
  const filteredHotels = hotels

  const handleNewSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (localQuery.trim()) {
      params.set('q', localQuery.trim())
    } else {
      params.delete('q')
    }
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <header className="border-b border-gray-200 px-6 py-3 relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="hover:opacity-70 transition-opacity shrink-0"
          >
            <img src="/engine-logo.svg" alt="Engine" className="h-8 w-auto" />
          </button>

          <div className="flex-1 flex items-center justify-center">
            {!searchExpanded ? (
              <div
                className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSearchExpanded(true)}
              >
                <div className="px-5 py-2 text-sm text-gray-700 border-r border-gray-200 max-w-[220px] truncate">
                  {location}
                </div>
                <div className="px-5 py-2 text-sm text-gray-700 border-r border-gray-200 whitespace-nowrap">
                  {checkIn} - {checkOut}
                </div>
                <div className="px-5 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {rooms}
                </div>
                {naturalQuery && (
                  <div className="px-3 py-1 mx-1 text-xs bg-amber-100 text-amber-800 rounded-full font-medium flex items-center gap-1 max-w-[180px]">
                    <Sparkles size={11} />
                    <span className="truncate">{naturalQuery}</span>
                  </div>
                )}
                <button className="m-1 w-9 h-9 bg-black rounded-full flex items-center justify-center">
                  <Search size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="w-full max-w-3xl" />
            )}
          </div>
        </div>

        {/* Expanded search overlay */}
        {searchExpanded && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-30"
              onClick={() => setSearchExpanded(false)}
            />
            <div className="absolute left-0 right-0 top-0 z-40 bg-white border-b border-gray-200 shadow-lg px-6 py-5">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => navigate('/')}
                  className="shrink-0"
                >
                  <img src="/engine-logo.svg" alt="Engine" className="h-8 w-auto" />
                </button>
                <button
                  onClick={() => setSearchExpanded(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex gap-3">
                    {/* Location */}
                    <div className="flex-1 bg-gray-50 rounded-full flex items-center px-4 py-3 gap-3 border border-gray-200 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                      <MapPinIcon size={18} className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                        placeholder="Where are you going?"
                        autoFocus
                      />
                      {editLocation && (
                        <button onClick={() => setEditLocation('')} className="text-gray-400 hover:text-gray-600">
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="bg-gray-50 rounded-full flex items-center px-4 py-3 gap-3 border border-gray-200 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                      <CalendarDays size={18} className="text-gray-400" />
                      <input
                        type="text"
                        value={editCheckIn}
                        onChange={(e) => setEditCheckIn(e.target.value)}
                        className="w-14 outline-none text-sm text-gray-700 bg-transparent"
                      />
                      <span className="text-gray-300">→</span>
                      <input
                        type="text"
                        value={editCheckOut}
                        onChange={(e) => setEditCheckOut(e.target.value)}
                        className="w-14 outline-none text-sm text-gray-700 bg-transparent"
                      />
                    </div>

                    {/* Guests */}
                    <div className="bg-gray-50 rounded-full flex items-center px-4 py-3 gap-3 border border-gray-200 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                      <Users size={18} className="text-gray-400" />
                      <input
                        type="text"
                        value={editRooms}
                        onChange={(e) => setEditRooms(e.target.value)}
                        className="w-28 outline-none text-sm text-gray-700 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Natural search — same width as the row above */}
                  <div className="bg-gray-50 rounded-full flex items-center px-4 py-3 gap-3 border border-gray-200 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                    <Sparkles size={16} className="text-amber-500 shrink-0" />
                    <input
                      type="text"
                      value={editNaturalQuery}
                      onChange={(e) => setEditNaturalQuery(e.target.value)}
                      placeholder="Describe what you're looking for... e.g. quiet hotel with a good gym"
                      className="flex-1 outline-none text-sm text-gray-600 bg-transparent placeholder:text-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSearchExpanded(false)
                          const params = new URLSearchParams()
                          params.set('location', editLocation)
                          params.set('checkIn', editCheckIn)
                          params.set('checkOut', editCheckOut)
                          params.set('rooms', editRooms)
                          if (editNaturalQuery.trim()) params.set('q', editNaturalQuery.trim())
                          navigate(`/search?${params.toString()}`)
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={() => {
                    setSearchExpanded(false)
                    const params = new URLSearchParams()
                    params.set('location', editLocation)
                    params.set('checkIn', editCheckIn)
                    params.set('checkOut', editCheckOut)
                    params.set('rooms', editRooms)
                    if (editNaturalQuery.trim()) params.set('q', editNaturalQuery.trim())
                    navigate(`/search?${params.toString()}`)
                  }}
                  className="bg-black text-white rounded-full px-6 h-[46px] flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shrink-0 self-start"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-3 overflow-x-auto">
        {filterButtons.map((btn, i) => (
          <button
            key={i}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 whitespace-nowrap hover:bg-gray-50 transition-colors"
          >
            {btn.icon && <btn.icon size={14} />}
            {btn.label}
            {btn.hasDropdown && <ChevronDown size={14} />}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-500 whitespace-nowrap">
          108 properties
        </div>
      </div>

      {/* Content */}
      <div className="flex">
        {/* Results List */}
        <div className="flex-1 p-4 space-y-4 max-w-[880px] overflow-y-auto">
          {!hotelsLoaded ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            filteredHotels.map((hotel, i) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                naturalQuery={naturalQuery}
                isFirst={i === 0}
                aiSummary={aiSummaries[hotel.id]}
              />
            ))
          )}
        </div>

        {/* Map */}
        <div className="w-[480px] shrink-0 sticky top-0 h-screen border-l border-gray-200">
          {!mapLoaded ? <MapSkeleton /> : <MapView />}
        </div>
      </div>
    </div>
  )
}
