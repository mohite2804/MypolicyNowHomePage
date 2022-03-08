import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShareModule } from '../share/share.module';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { HealthRoutingModule } from './health-routing.module';
import { QuoteComponent } from './quote/quote.component';
import { QuotationComponent } from './quotation/quotation.component';
import { HealthComponent } from './health.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { ProposalComponent } from './proposal/proposal.component';
import { LoaderComponent } from './loader/loader.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
import { PolicyDetailsComponent } from './policy-details/policy-details.component';
import { TenurePolicyComponent } from './tenure-policy/tenure-policy.component';
import { ThankYouHealthComponent } from './thank-you-health/thank-you-health.component';
import { ShareProposalHealthComponent } from './share-proposal-health/share-proposal-health.component';

@NgModule({
  declarations: [

    QuoteComponent,
    QuotationComponent,
    HealthComponent,
    CustomerDetailComponent,
    LoaderComponent,
    ProposalComponent,
    ConfirmDetailsComponent,
    PolicyDetailsComponent,
    TenurePolicyComponent,
    ThankYouHealthComponent,
    ShareProposalHealthComponent
    

  ],
  imports: [
    CommonModule,
    HealthRoutingModule,
    FormsModule,
    NgSelectModule,
    ShareModule,
    NgbModule
    
  ]
  
})
export class HealthModule { }
