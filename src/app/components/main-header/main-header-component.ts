import { Component } from '@angular/core';
import { PackmanService } from 'src/app/business/packman/packman-service';

@Component({
    selector: 'app-main-header',
    templateUrl: './main-header-component.html',
    styleUrls: ['./main-header-component.scss']
})
export class MainHeaderComponent {
    public packmanService:PackmanService;

    constructor(packmanService:PackmanService){
        this.packmanService = packmanService;
    }
}