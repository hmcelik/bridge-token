import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';
import { WalletManagementButtons } from '@transferto/shared/src';
import { ChainSwitch } from '@transferto/shared/src/atoms/ChainSwitch';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { useChains } from '../../hooks/useChains';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { ThemeSwitch } from '../ThemeSwitch';
import {
  NavbarDropdownButton,
  NavbarManagement as NavbarManagementContainer,
} from './Navbar.style';

const NavbarManagement = () => {
  const mainMenuAnchor = useRef<any>(null);

  const onWalletDisconnect = useSettingsStore(
    (state) => state.onWalletDisconnect,
  );

  const [openMainNavbarMenu, onOpenNavbarMainMenu] = useMenuStore(
    (state) => [state.openMainNavbarMenu, state.onOpenNavbarMainMenu],
    shallow,
  );

  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const walletManagement = useWallet();
  const { account } = useWallet();
  !account.isActive ?? onWalletDisconnect();

  // return focus to the button when we transitioned from !open -> open
  const prevMainMenu = useRef(openMainNavbarMenu);
  useEffect(() => {
    if (prevMainMenu.current === true && openMainNavbarMenu === false) {
      mainMenuAnchor!.current.focus();
    }

    prevMainMenu.current = openMainNavbarMenu;
  }, [openMainNavbarMenu]);

  const { isSuccess } = useChains();

  const handleOnOpenNavbarMainMenu = () => {
    onOpenNavbarMainMenu(!openMainNavbarMenu, mainMenuAnchor.current);
  };

  return (
    <NavbarManagementContainer className="settings">
      <WalletManagementButtons
        walletManagement={walletManagement}
        connectButtonLabel={
          <Typography
            variant={'lifiBodyMediumStrong'}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {translate(`${i18Path}connectWallet`)}
          </Typography>
        }
        isSuccess={isSuccess}
      />
      {account.isActive ? <ChainSwitch /> : null}
      <ThemeSwitch />
    </NavbarManagementContainer>
  );
};

export default NavbarManagement;
