import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import SwitchThemeButton from '../../components/ui/SwitchTheme'
import { useContext } from 'react'
import { useCurrentIndex } from '../../hooks/useCurrentIndex';
import { UserContext } from '../../contexts/UserContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { IconLogo } from '../../components/logo/logo_org';
import { IconButton } from '@mui/material';
import { MessageSharp } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Workouts', href: '/workouts' },
  { name: 'My Workouts', href: '/workouts/my-workouts' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const { isDark } = useThemeColor()
  const current = useCurrentIndex()
  const navigate = useNavigate();

  return (
    <Disclosure
      as="nav"
      className={`fixed border-b-solid border-b-1 ${
        isDark
          ? "bg-[#202124] border-b-[#4242424f]"
          : "bg-[#fff] border-b-[#97979731]"
      } w-full z-150000`}
    >
      <div className="mx-auto max-w-[2000px] px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            {user.isLogged && (
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            )}
          </div>
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <div className="flex shrink-0 items-center">
              <a href="/workouts" className="w-13">
                <IconLogo />
              </a>
            </div>
            {user.isLogged && (
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={index === current ? "page" : undefined}
                      className={classNames(
                        index === current
                          ? "bg-blue-800/80 text-white"
                          : "hover:bg-blue-800/60 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium",
                        isDark ? "text-[#757575]" : "text-[#121212]"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <SwitchThemeButton />
            {user.isLogged && (
              <IconButton onClick={() => navigate('/chat-friends')}>
                <MessageSharp color="info" />
              </IconButton>
            )}
            {/* Profile dropdown */}
            {user.isLogged && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={user.photo}
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      href={`/profile/${user._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      onClick={() => setUser({})}
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
