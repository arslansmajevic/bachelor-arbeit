import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecShowPanelComponent } from './rec-show-panel.component';

describe('RecShowPanelComponent', () => {
  let component: RecShowPanelComponent;
  let fixture: ComponentFixture<RecShowPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecShowPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecShowPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
