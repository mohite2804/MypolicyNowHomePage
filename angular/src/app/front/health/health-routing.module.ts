import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthComponent } from './health.component';
import { QuoteComponent } from './quote/quote.component';
import { QuotationComponent } from './quotation/quotation.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
import { ProposalComponent } from './proposal/proposal.component';
import { PolicyDetailsComponent } from './policy-details/policy-details.component';
import { TenurePolicyComponent } from './tenure-policy/tenure-policy.component';
import { ThankYouHealthComponent } from './thank-you-health/thank-you-health.component';
import { ShareProposalHealthComponent } from './share-proposal-health/share-proposal-health.component';
import { ShareLayoutComponent } from '../share-layout/share-layout.component';


const routes: Routes = [
  
    {
      path :  "" ,
      component : HealthComponent,
      children : [
        { path: "", component:QuoteComponent},
        { path: "health-insurance-quote", component:QuoteComponent},
        { path: "quotation", component:QuotationComponent},
        { path: "tenure-policy", component:TenurePolicyComponent},
        { path: "customer-details", component:CustomerDetailComponent},
        { path: "confirm-details", component:ConfirmDetailsComponent}, 
        { path: "policy-details", component:PolicyDetailsComponent},     
        { path: "proposal", component:ProposalComponent},
        { path: "thank-you-health", component:ThankYouHealthComponent},
        { path: "share-proposal-health", component:ThankYouHealthComponent}

      ]
    }  
  





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthRoutingModule { }
