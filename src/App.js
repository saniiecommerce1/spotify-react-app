import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [albumsData, setAlbumsData] = useState([])
  useEffect(() => {
    const CLIENT_ID = "08154ecce5c2408385c8359dd39a5113"
    const CLIENT_SECRET = "32c925a2468047d7a2eda5eda46b5bd6"
    const bodyData = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    axios.post("https://accounts.spotify.com/api/token", bodyData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then((res) => {
      console.log("Res", res)
      setToken(res.data.access_token)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const handleChange = (e) => {

    setSearchTerm(e.target.value)
  }
  const getAlbumsData = async () => {
    const authHeaders = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    let artistData = await axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=artist`, authHeaders)
    console.log("Artist Data", artistData)
    let artistId = artistData.data.artists.items[0].id


    let albumsDataa = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50&market=US`, authHeaders)
    console.log("Albums Data", albumsDataa.data)
    setAlbumsData(albumsDataa.data.items)
  }

  return (
    <div className="App">
      <div className="p-4 bg-gray-100">
        <div className="relative">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Enter Artist Name..."
            className="w-full px-4 py-2 pr-12 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={getAlbumsData}
            className="absolute inset-y-0 right-0 px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none"
          >
            Search
          </button>
        </div>
      </div>

      {
        albumsData ?
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-5 md:mx-20 gap-x-5 gap-y-5 py-12 justify-items-center md: justify-items-start'>
            {
              albumsData.map((album) => {
                return (
                  <>
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                      <a
                        href={album.external_urls.spotify}
                        target='_blank'
                      >
                        <img className="w-full" src={album.images[0].url} alt="Sunset in the mountains" />
                        <div className="px-6 py-4">
                          <div className="font-bold text-xl mb-2">{album.name}</div>
                          <p className="text-gray-700 text-base">
                            {album.artists[0].name}
                          </p>
                        </div>
                        <div className="px-6 pt-4 pb-2">
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Total Tracks: {album.total_tracks}</span>
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Released on: {album.release_date}</span>

                        </div>
                      </a>
                    </div>
                  </>
                )
              })
            }

          </div>


          :
          <div className='flex justify-center items-center h-60'>
            <h1 className='text-5xl text-gray-400'>Search any Artist Albums...</h1>
          </div>
      }

    </div >
  );
}

export default App;
