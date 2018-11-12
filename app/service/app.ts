import { observable, action, runInAction, computed } from 'mobx';
import debounce from 'lodash/debounce';

declare const MODE : string;

class AppService {

    public isDEBUG : boolean = (MODE === 'development');

    @observable public isModalOpen : boolean = false;
    @observable public width : number = window.innerWidth;

    public mountedModal;

    constructor() {
        window.addEventListener(
            'resize',
            debounce(
                () => runInAction(() => (this.width = window.innerWidth)),
                100
            )
        );
    }

    @computed get isMobile() : boolean {
        return this.width <= 1000;
    }

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
