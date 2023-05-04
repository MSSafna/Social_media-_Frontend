
import React, { useState, useEffect } from 'react';
import { axiosPrivate as axios } from '../../../API/axios';
import Pagination from './Pagination';
import Filter from './Filter'
import { Button } from '@chakra-ui/react';
import {CiFilter} from 'react-icons/ci'
import {AiOutlineSortAscending} from 'react-icons/ai'
import {AiOutlineSortDescending} from 'react-icons/ai'

function Table() {
  const [values, setUser] = useState([]);
  const [currentPage, setCurrentpage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [filteredTextValue, setFilterTextValue] = useState('all')
  const [searchingName, setSearchingName] = useState('')
  const [sortingOrder, setSortingOrder] = useState('asending')
  const options = ['all', 'blocked', 'unblock']






  const lastPostIndex = currentPage * postPerPage
  const firstPostIndex = lastPostIndex - postPerPage
  const currentPost = values.slice(firstPostIndex, lastPostIndex)

 
  let filteredValue = currentPost
  .filter((user) => {
    if (filteredTextValue === 'blocked') {
      return user.status === true;
    } else if (filteredTextValue === 'unblock') {
      return user.status === false;
    } else if (filteredTextValue == 'all') {
      return user;
    } else {
      return user.username === filteredTextValue;
    }
  })
  .sort((a, b) => {
   if(sortingOrder == 'asending'){
    if(a.username > b.username) return 1
      if(a.username < b.username) return -1
        return 0
   }
   else{
    if(a.username > b.username) return -1
      if(a.username < b.username) return 1
        return 0
   }
  });

  
  
  useEffect(() => {
    getallusers();
  }, []);

  function getallusers() {
    axios.get('/api/admin/allusers')
      .then((response) => {
        setUser(response.data);
      }).catch((error) => {
        console.log(error);
      });
  }

  const controlUserState = (async (e, userId) => {
    const status = e.target.checked
    const res = await axios.put(`api/admin/status?userId=${userId}&status=${status}`);
  })

  const filterHandle = (filterValue) => {
    setFilterTextValue(filterValue)
   
  }

const handleSearch = () =>{
  console.log(searchingName);
  setFilterTextValue(searchingName)
}

// useEffect(() => {
//   let result = filterdValue.sort((a,b) => {
//    if(a.username > b.username) return 1
//    if(a.username < b.username) return -1
//    return 0
//   })
//   console.log(result,'result'); 

//   filterdValue = result
// },[sortingOrder])

const handleSort =(sortingorder) => {
  console.log(sortingorder);
  setSortingOrder(sortingorder)
}

// console.log(filterdValue,'filterdValue');

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 ">
      <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8 ">
        <div className="overflow-hidden ">
          <div className='flex flex-row w-grow mt-4'>
        <div className='p-2'>
          {sortingOrder == 'asending' ?
          <AiOutlineSortDescending size={25} onClick={() => {
            handleSort('desending')
          }}/> : 
           <AiOutlineSortAscending size={25}  onClick={() => {
          handleSort('asending')
          
        }}/>
          }
          </div>
          <div className='p-1'>
          <Filter filterHandle={filterHandle} options={options} />
          </div>
            
            <input type="text" className='border border-600  rounded-md  w-52 ml-4 pl-2' placeholder='Search by name' onChange={(e) => {
              setSearchingName(e.target.value)
            }}/>
            <Button colorScheme='blue' size='sm' className='ml-2' onClick={handleSearch}>Search</Button>
          
          </div>

          <table className="min-w-full  relative">
            <thead className="border-b">
              <tr>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  No
                </th>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Name
                </th>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Email
                </th>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {
                filteredValue.map((element, i) => (
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{firstPostIndex + i + 1}</td>

                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {element.username}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {element.email}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <label className="inline-flex relative items-center mr-5 cursor-pointer">
                        {element.status ?
                          <input type="checkbox" value="" className="sr-only peer" onChange={(e) => controlUserState(e, element._id)} checked /> :
                          <input type="checkbox" value="" className="sr-only peer" onChange={(e) => controlUserState(e, element._id)} />
                        }
                        <div className="w-11 h-6  bg-green-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                      </label>
                    </td>
                  </tr>
                ))
              }
              <div className='p-2 '>
                <Pagination totalPost={values.length} postPerPage={postPerPage} setCurrentpage={setCurrentpage} currentPage={currentPage} />
              </div>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default Table;
