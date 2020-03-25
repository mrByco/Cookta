import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ImageCroppedEvent} from "ngx-image-cropper";

@Component({
  selector: 'app-food-image-upload',
  templateUrl: './food-image-upload.component.html',
  styleUrls: ['./food-image-upload.component.css']
})
export class FoodImageUploadComponent {

  @Input() public InputHidden: boolean = false;
  @Input() public AspectRatio: number = 1;
  @Input() public EditMode: boolean;
  @Input() public SourceUrl: any = "";

  public EditAvailable = false;
  public ImageChangedEvent: any = '';
  public CroppedImage: any = null;
  public CroppedImageBase64: any = '';

  @ViewChild('fileInput', {static: true}) fileInput:ElementRef;

  public OpenInputDialog():void {
    let event = new MouseEvent('click', {bubbles: false});
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  public fileChangeEvent(event: any): void {
    this.ImageChangedEvent = event;
  }
  public imageCropped(event: ImageCroppedEvent) {
    this.CroppedImage = event.file;
    this.CroppedImageBase64 = event.base64;
  }
  public imageLoaded() {
    this.EditMode = true;
    this.EditAvailable = true;
  }
  public cropperReady() {
  }
  public loadImageFailed() {
    console.log("failed")
    // show message
  }

  GetCroppedUrl(file: any): string {
    return URL.createObjectURL(file);
  }
}
