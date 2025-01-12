import { BsDownload } from 'react-icons/bs';
import { useReactPWAInstall } from 'react-pwa-install';
import logo from '../../../public/logo192.png';

const InstallButton = () => {
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

  const installApp = () => {
    pwaInstall({
      title: "Laax-2024 Tierlist",
      logo: logo,
      features: (
        <ul>
          <li>official Tierlist</li>
          <li>Works offline</li>
        </ul>
      ),
      description: "official Tierlist for the worldchampionship Laax 2024",
    })
      .catch((e) => {
        console.warn(e)
      });
  };

  return (
    <>
      {supported() && !isInstalled() && (
        <button className="btn btn-link" onClick={installApp}>
          <BsDownload className="icon-white" />
        </button>
      )}
    </>
  );
}

export default InstallButton;
