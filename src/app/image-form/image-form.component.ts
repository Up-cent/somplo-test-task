import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss'],
})
export class ImageFormComponent {
  form: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      image: [null],
      animation: '',
      imageSize: ['100%'],
      containerWidth: ['400px'],
      containerHeight: ['300px'],
      positionX: ['0'],
      positionY: ['0'],
    });
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result;
        this.form.patchValue({
          image: reader.result,
        });
      };
    }
  }

  // reduce number of animations in html file by adding switch/case codition
  getAnimationCss(animation: string): string {
    switch (animation) {
      case 'slideInFromTop':
        return `
          @keyframes slideInFromTop {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(0);
            }
          }
          .animation {
            animation: slideInFromTop 2s forwards;
          }
        `;
      case 'zoomInFromBottom':
        return `
          @keyframes zoomInFromBottom {
            from {
              transform: scale(0) translateY(100%);
            }
            to {
              transform: scale(1) translateY(0);
            }
          }
          .animation {
            animation: zoomInFromBottom 2s forwards;
          }
        `;
      default:
        return '';
    }
  }

  downloadHtml() {
    const animation = this.form.get('animation')?.value;
    const image = this.imageSrc;
    const animationCss = this.getAnimationCss(animation);
    const imageSize = this.form.get('imageSize')?.value;
    const containerWidth = this.form.get('containerWidth')?.value;
    const containerHeight = this.form.get('containerHeight')?.value;
    const positionX = this.form.get('positionX')?.value;
    const positionY = this.form.get('positionY')?.value;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${animationCss}
          .container {
            width: ${containerWidth};
            height: ${containerHeight};
            position: relative;
          }
          .image {
            width: ${imageSize};
            position: absolute;
            top: ${positionY};
            left: ${positionX};
          }
        </style>
      </head>
      <body>
        <div class="container animation">
          <img src="${image}" alt="Uploaded Image" class="image" />
        </div>
      </body>
      </html>
  `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, 'download.html');
  }
}
