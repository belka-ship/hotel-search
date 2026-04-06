import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  CalendarDays,
  Users,
  Search,
  X,
  Plane,
  Car,
  Users2,
  Bell,
  Hotel,
  Sparkles,
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('FiDi, New York, NY, USA')
  const [checkIn, setCheckIn] = useState('Apr 21')
  const [checkOut, setCheckOut] = useState('Apr 23')
  const [rooms, setRooms] = useState('1 room, 1 guest')
  const [naturalQuery, setNaturalQuery] = useState('')
  const [activeTab, setActiveTab] = useState('lodging')

  const tabs = [
    { id: 'lodging', label: 'Lodging', icon: Hotel },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'cars', label: 'Cars', icon: Car },
    { id: 'groups', label: 'Groups', icon: Users2 },
  ]

  const handleSearch = () => {
    const params = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      rooms,
    })
    if (naturalQuery.trim()) {
      params.set('q', naturalQuery.trim())
    }
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-16 border-r border-gray-200 flex flex-col items-center py-4 gap-6 shrink-0">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600">
          <Bell size={20} />
        </button>
        <div className="mt-2 text-[10px] text-gray-400 font-medium tracking-wider uppercase">Travel</div>
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 bg-gray-100 rounded-lg">
          <Plane size={18} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600">
          <Hotel size={18} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600">
          <CalendarDays size={18} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Hero Section */}
        <div className="bg-[#B8E8E8] rounded-3xl p-8 pb-0 relative overflow-hidden min-h-[380px]">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-base font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-transparent text-black hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 relative z-10">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-3">
                {/* Location */}
                <div className="flex-1 bg-white rounded-full flex items-center px-5 py-3 gap-3 border border-gray-200">
                  <MapPin size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                  />
                  {location && (
                    <button onClick={() => setLocation('')} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Dates */}
                <div className="bg-white rounded-full flex items-center px-5 py-3 gap-3 border border-gray-200">
                  <CalendarDays size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-700 whitespace-nowrap">{checkIn}</span>
                  <span className="text-gray-300">→</span>
                  <span className="text-sm text-gray-700 whitespace-nowrap">{checkOut}</span>
                </div>

                {/* Guests */}
                <div className="bg-white rounded-full flex items-center px-5 py-3 gap-3 border border-gray-200">
                  <Users size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-700 whitespace-nowrap">{rooms}</span>
                </div>
              </div>

              {/* Natural Search — same width as the row above */}
              <div className="bg-white/80 backdrop-blur rounded-full flex items-center px-5 py-3 gap-3 border border-gray-200/60">
                <Sparkles size={16} className="text-amber-500 shrink-0" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="Describe what you're looking for... e.g. quiet hotel with good gym"
                  className="flex-1 outline-none text-sm text-gray-600 bg-transparent placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-black text-white rounded-full px-6 h-[46px] flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors self-start"
            >
              <Search size={18} />
              Search
            </button>
          </div>

          {/* Hotel Image */}
          <div className="absolute right-8 bottom-0 w-[380px] h-[300px] z-0">
            <div className="w-full h-full bg-gradient-to-t from-[#B8E8E8] via-transparent to-transparent absolute bottom-0 pointer-events-none z-10" />
            <img
              src="/lodging_hp.webp"
              alt="Hotel"
              className="w-full h-full object-cover object-center rounded-t-2xl opacity-80"
            />
          </div>
        </div>

        {/* Trip Activity */}
        <div className="mt-6">
          <h3 className="text-xs font-bold tracking-wider uppercase mb-4 text-gray-900">Trip Activity</h3>
          <div className="flex gap-6">
            {/* Car Rental Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 w-[360px] shrink-0">
              <div className="bg-amber-400 rounded-xl h-[200px] overflow-hidden mb-4">
                <img
                  src="/car.png"
                  alt="Rental car"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-xl font-bold text-gray-900">Los Angeles, CA</h4>
                <div className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded">U-SAVE</div>
              </div>
              <p className="text-sm text-gray-500 mb-4">Apr 8 - Apr 10 &nbsp;•&nbsp; Special car &nbsp;•&nbsp; Kah Ee Poon</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Car size={14} className="text-gray-400" />
                  <span><span className="font-semibold">U-Save</span> Los Angeles</span>
                </div>
                <span className="text-sm text-gray-400 font-mono">#F621A838</span>
              </div>
            </div>

            {/* Hotel Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 w-[360px] shrink-0">
              <div className="relative rounded-xl h-[200px] overflow-hidden mb-4">
                <img
                  src="/hotel_trip.webp"
                  alt="The Hotel Ojibway"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white text-[11px] font-semibold px-3 py-1 rounded-full text-gray-800 shadow-sm">
                  UPCOMING
                </span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1 leading-tight">The Hotel Ojibway, Trademark Collection by Wyndham</h4>
              <p className="text-sm text-gray-500 mb-4">Apr 17 - Apr 25 &nbsp;•&nbsp; Vadim Pikarevskis</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                <MapPin size={14} className="text-gray-400" />
                <span>Sault Sainte Marie, MI</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
