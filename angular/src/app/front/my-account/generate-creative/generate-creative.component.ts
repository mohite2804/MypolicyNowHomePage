import { Component, OnInit ,ElementRef, ViewChild} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router,Params} from  '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-generate-creative',
  templateUrl: './generate-creative.component.html',
  styleUrls: ['./generate-creative.component.css']
})
export class GenerateCreativeComponent implements OnInit {

  @ViewChild("chgcolor") chgcolor: ElementRef;
	generateCreativeData  : any;
  loginUserId  : any;
	id: string;
  greeting_id : any;
  loaderActive: boolean = false;

  constructor(private commonService: CommonService,public router: Router,private route: ActivatedRoute) { }

  	ngOnInit(): void {
      this.greeting_id=this.route.snapshot.paramMap.get('id');
      this.loginUserId = sessionStorage.getItem('user_id');
      this.getIndex();

  	}

    getIndex(){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('greeting_id',this.greeting_id);
      sendData.append('loginUserId',this.loginUserId);

       this.commonService.getGenerateCreativeImagesData(sendData)
       .subscribe((response) => {
        this.loaderActive = false;
            var result : any = response;
            this.generateCreativeData = result.result;
        });

    }

    colorTextChange(event){
      console.log(event.target.value);
      let el : any = this.chgcolor.nativeElement;
      el.setAttribute('style', 'color: '+event.target.value+' !important');
      //this.chgcolor.nativeElement.style.color = "'"+event.target.value+"'";
    //  this.chgcolor.nativeElement.style.colorTextChange = "#fb0e0e";
    }

    async downloadGreeting(){
      this.loaderActive = true;
      await htmlToImage.toJpeg(document.getElementById('my-node'), { quality: 0.95 })
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = 'greeting.jpeg';
          link.href = dataUrl;
          link.click();

        });
         this.loaderActive = false;
    }


}
