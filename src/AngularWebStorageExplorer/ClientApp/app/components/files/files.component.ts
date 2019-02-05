import { Component, Inject, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { BaseComponent } from '../base/base.component';
import { elementDef } from '@angular/core/src/view';
import { NgIf } from '@angular/common';
import { Headers } from '@angular/http';

@Component({
    selector: 'files',
    templateUrl: './files.component.html'
})

export class FilesComponent extends BaseComponent {
    //forceReload: boolean;

    @Output() refresh: EventEmitter<boolean> = new EventEmitter();

    @Input() share: string = "";

    public showTable: boolean = false;
    public folder: string = "";
    public files: any;
    public selected: any;

    public removeContainerFlag: boolean = false;

    constructor(utils: UtilsService) {
        super(utils);
        this.getFiles();
    }

    ngOnChanges() {
        this.getFiles();
    }

    setFolder(event: Event) {

        var element = (event.currentTarget as Element);
        var folder = (element.parentElement!.children[1]!.textContent as string).trim();

        this.internalSetFolder(folder);
    }

    setCurrentFolder(event: Event) {
        var element = (event.currentTarget as Element);
        var folder = (element.textContent as string).trim();

        this.internalSetFolder(folder);
    }

    internalSetFolder(folder: string) {

        if (this.folder)
            this.folder = this.folder + "\\" + folder;
        else
            this.folder = folder;

        this.getFiles();
    }

    levelUp() {

        var slash = this.folder.lastIndexOf("\\");
        if (slash > 0)
            this.folder = this.folder.substr(0, slash);
        else
            this.folder = '';

        this.getFiles();
    }

    getFiles() {

        if (!this.share) {
            this.showTable = false;
            return;
        }

        this.loading = true;
        this.showTable = false;
        this.utilsService.getData('api/Files/GetFilesAndDirectories?share=' + this.share + '&folder=' + this.folder).subscribe(result => {
            this.files = result.json();
            this.loading = false;
            this.showTable = true;
        }, error => { this.setErrorMessage(error.statusText); });
    }
    //Code to download File
    downloadFile(fileUrl: string) {
        var key = "?sv=2018-03-28&ss=bfqt&srt=sco&sp=rl&se=2019-02-27T19:56:14Z&st=2019-02-01T11:56:14Z&spr=https,http&sig=m6bZa86lOin2Awo2Auy3d6p0SVIAG3BTjIYOnDPsFws%3D";
        window.location.href = fileUrl + key;
    }

    ////Code to view File in Browser
    //viewFile(filename: string, fileUrl: string) {
    //    var key = "?sv=2018-03-28&ss=bfqt&srt=sco&sp=rl&se=2019-02-27T19:56:14Z&st=2019-02-01T11:56:14Z&spr=https,http&sig=m6bZa86lOin2Awo2Auy3d6p0SVIAG3BTjIYOnDPsFws%3D";
    //    if (filename.endsWith(".pdf")) {
    //        //window.location.href = "https://docs.google.com/viewer?url=" + fileUrl + key + "/export?format=pdf";
    //        window.open("https://docs.google.com/viewer?url=" + fileUrl + key + "/export?format=pdf");
    //    }
    //}
}