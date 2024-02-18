import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { capitalizeFirstLetter } from './utils/functions';
import { useEffect, useState } from 'react';
import { FaCaretDown, FaLocationDot } from 'react-icons/fa6';
function App() {
  const today = startOfToday();
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const monthInYear = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
  ];
  const [yearDisplay, setIsYearDisplay] = useState(false);
  const [monthDisplay, setIsMonthDisplay] = useState(true);
  const [currMonth, setCurrMonth] = useState(() => format(today, 'MMM-yyyy'));
  let firstDayOfMonth = parse(currMonth, 'MMM-yyyy', new Date());
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const years = Array.from(
    { length: 10 },
    (_, index) => selectedYear - 5 + index
  );
  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };

  const isHoliday = (day: Date): boolean => {
    const thismonth = [];
    thismonth.push(format(day, 'MMM'));
    const monthIndex = monthMap[thismonth[0]];
    const thisyear = [];
    thisyear.push(format(day, 'yyyy'));
    const thisday = [];
    thisday.push(format(day, 'dd'));
    const checkday = String(`${thisyear[0]}-${monthIndex}-${thisday[0]}`);

    return HolidayDays.some((item) => item.date === checkday);
  };
  const yearDisplayHanlder = () => {
    setIsYearDisplay(true);
    setIsMonthDisplay(false);
  };

  const monthDisplayHanlder = () => {
    setIsYearDisplay(false);
    setIsMonthDisplay(true);
  };

  const monthHandler = (month: number, year: string) => {
    const date = new Date(parseInt(year), month); // January 2024
    const formattedDate = format(date, 'MMM-yyyy');
    setCurrMonth(formattedDate);

    if (monthDisplayHanlder) {
      monthDisplayHanlder();
    }
  };

  const handleYearSelection = (year: number) => {
    setSelectedYear(year);
    const firstDayOfCurrMonth = parse(currMonth, 'MMM-yyyy', new Date());
    const newYear = format(firstDayOfCurrMonth, `MMM-${year}`);
    setCurrMonth(newYear);
    setIsYearOpen(false);
  };
  const handleMonthSelection = (month: number) => {
    const year = new Date().getFullYear(); // Assuming current year
    const newMonth = format(new Date(year, month), 'MMM-yyyy');
    setCurrMonth(newMonth);
    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => {
    setIsYearOpen(!isYearOpen);
  };
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  });

  const getPrevYear = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    setYear(String(parseInt(year) - 1));
    setSelectedYear(parseInt(year) - 1);
  };
  const getNextYear = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    setYear(String(parseInt(year) + 1));
    setSelectedYear(parseInt(year) + 1);
  };

  const getPrevMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setCurrMonth(format(firstDayOfPrevMonth, 'MMM-yyyy'));
  };
  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrMonth(format(firstDayOfNextMonth, 'MMM-yyyy'));
  };
  const [country, setCountry] = useState<string>('Andorra');
  const [countryCode, setCountryCode] = useState<string>('AD');
  const [year, setYear] = useState<string>('2024');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [region, setRegion] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cardsData, setData] = useState([]);

  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCountry(e.target.value);
    const countryID = await cardsData.find(
      (item: { name: string; countryCode: string }) =>
        item.name === e.target.value
    );
    if (countryID) {
      setCountryCode(countryID.countryCode);
    }
    fetchHolidyList();
  };

  const handleSubmit = () => {
    close();
  };

  const countryListUrl = 'https://date.nager.at/api/v3/AvailableCountries';

  const fetchCountryList = async () => {
    return await fetch(countryListUrl)
      .then((res) => res.json())
      .then((d) => setData(d));
  };

  const HolidayListUrl = `https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`;
  const [HolidayDays, setHolidayDays] = useState([]);

  const fetchHolidyList = async () => {
    return await fetch(HolidayListUrl)
      .then((res) => res.json())
      .then((d) => setHolidayDays(d));
  };
  useEffect(() => {
    fetchHolidyList();
  }, []);

  const open = async () => {
    await fetchCountryList();
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <div className='p-8 w-screen h-screen flex items-center justify-center'>
      <div className='w-[900px] h-[600px]'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-row'>
            {monthDisplay && (
              <div className='flex items-center mr-4 justify-evenly gap-6 sm:gap-12'>
                <ChevronLeftIcon
                  className='w-5 h-5 cursor-pointer'
                  onClick={getPrevMonth}
                />
                <ChevronRightIcon
                  className='w-5 h-5 cursor-pointer'
                  onClick={getNextMonth}
                />
              </div>
            )}
            {yearDisplay && (
              <div className='flex items-center justify-evenly gap-6 sm:gap-12'>
                <ChevronLeftIcon
                  className='w-6 h-6 cursor-pointer'
                  onClick={getPrevYear}
                />
                <ChevronRightIcon
                  className='w-6 h-6 cursor-pointer'
                  onClick={getNextYear}
                />
              </div>
            )}
            <div className='font-semibold text-xl flex flex-row'>
              <div className='relative'>
                {monthDisplay && (
                  <div className='flex flex-row items-center mr-6'>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className='text-2xl leading-6 font-bold text-blue-500 mr-1'
                    >
                      {format(firstDayOfMonth, 'MMMM ')}
                    </button>
                    <FaCaretDown className='text-slate-500 pt-0.5' />
                  </div>
                )}
                {isDropdownOpen && (
                  <ul className='absolute z-10 top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md'>
                    {monthInYear.map((month, index) => (
                      <li
                        key={month}
                        className='cursor-pointer px-4 py-2 hover:bg-gray-100'
                        onClick={() => handleMonthSelection(index)}
                      >
                        {month}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                onClick={toggleDropdown}
                className='cursor-pointer relative flex flex-row items-center mr-4'
              >
                <button className='text-2xl leading-6 font-bold text-blue-500 mr-1 mt-0.5'>
                  {selectedYear}
                </button>
                <FaCaretDown className='text-slate-500 pt-0.5' />
                {isYearOpen && (
                  <ul className='absolute z-10 top-8 right-0 bg-white border border-gray-200 rounded-md shadow-md overflow-auto'>
                    {years.map((year) => (
                      <li
                        key={year}
                        className={`cursor-pointer p-2 hover:bg-gray-100 mx-2`}
                        onClick={() => handleYearSelection(year)}
                      >
                        {year}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <>
            <div
              onClick={open}
              className='flex flex-row justify-center items-center text-xl border-2 rounded-md px-2'
            >
              <FaLocationDot className='text-blue-700' />
              <button className=' text-slate-600 py-2 px-2 rounded '>
                {country}
              </button>
              <FaCaretDown className='text-slate-500' />
            </div>

            {/* Modal */}
            {isOpen && (
              <div className='fixed inset-0 flex items-center justify-center z-50'>
                <div
                  className='absolute inset-0 bg-black opacity-50'
                  onClick={close}
                ></div>
                <div className='bg-white rounded-lg p-6 z-10'>
                  <h2 className='text-lg font-semibold mb-4'>Select Country</h2>
                  <div className='mb-4'>
                    <label htmlFor='country' className='block font-medium mb-2'>
                      Country:
                    </label>
                    <select
                      id='country'
                      className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500'
                      onChange={handleCountryChange}
                    >
                      {(cardsData as { name: string }[]) &&
                        (cardsData as { name: string }[]).map((item) => (
                          <>
                            <option value={item.name}>{item.name} </option>
                          </>
                        ))}
                    </select>
                  </div>
                  <div className='mt-6'>
                    <button
                      onClick={handleSubmit}
                      className='bg-blue-500 text-white py-2 px-4 rounded mr-4'
                    >
                      Save
                    </button>
                    <button
                      onClick={close}
                      className='bg-gray-300 text-gray-700 py-2 px-4 rounded'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
          <div>
            <button
              onClick={yearDisplayHanlder}
              className='py-1 px-3 mx-2 bg-blue-500 hover:bg-blue-700 text-white rounded shadow-md hover:shadow-lg transition duration-300 ease-in-out'
            >
              Year
            </button>
            <button
              onClick={monthDisplayHanlder}
              className='py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white rounded shadow-md hover:shadow-lg transition duration-300 ease-in-out'
            >
              Month
            </button>
          </div>
        </div>
        <hr className='my-5' />
        {monthDisplay && (
          <div className='grid grid-cols-7 gap-6 sm:gap-12 place-items-center '>
            {days.map((day, idx) => {
              return (
                <div key={idx} className='font-semibold '>
                  {capitalizeFirstLetter(day)}
                </div>
              );
            })}
          </div>
        )}
        {monthDisplay && (
          <div className='grid grid-cols-7 gap-6 sm:gap-12 mt-8 place-items-center'>
            {daysInMonth.map((day, idx) => {
              return (
                <div
                  key={idx}
                  className={`${
                    colStartClasses[getDay(day)]
                  } cursor-pointer overflow-hidden border-gray-200 flex flex-col items-center justify-center`}
                >
                  <p
                    className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-full 
                  ${isSameMonth(day, today) ? 'text-gray-900' : 'text-gray-400'}
                  ${!isToday(day) && 'hover:bg-gray-100'}
                  ${
                    isToday(day) && 'bg-green-500 text-white hover:bg-green-600'
                  }
                  ${
                    isHoliday(day) && 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                  >
                    {format(day, 'd')}
                  </p>
                  <div className='cursor-pointer flex items-center justify-center flex-wrap text-xs text-red-500'>
                    <p
                      className={`cursor-pointer flex items-center justify-center h-8  rounded-full font-medium`}
                    >
                      {
                        HolidayDays.find(
                          (item: { date: string }) =>
                            item.date === format(day, 'yyyy-MM-dd')
                        )?.name
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {yearDisplay && (
          <div className='grid grid-cols-4 gap-6 sm:gap-12 mt-8 place-items-center'>
            {monthInYear.map((month, idx) => {
              return (
                <div
                  key={idx}
                  className=' cursor-pointer overflow-hidden text-slate-600 hover:text-blue-500 border-gray-200 '
                >
                  <p
                    className='cursor-pointer flex items-center justify-center text-xl font-semibold h-8}'
                    onClick={() => monthHandler(idx, year)}
                  >
                    {month}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
