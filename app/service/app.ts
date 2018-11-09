import { observable, action } from 'mobx';

declare const MODE : string;

class AppService {

    public isDEBUG : boolean = (MODE === 'development');

    @observable public isModalOpen : boolean = false;

    public mountedModal;

    @action
    public closeModal = () => {
        this.isModalOpen = false;
        this.mountedModal = undefined;
    }

    @action
    public openModal(modalComponent) {
        this.closeModal();
        this.isModalOpen = true;
        this.mountedModal = modalComponent;
    }

}

const appService = new AppService();

export default appService;
