import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotChatComponent } from './not-chat.component';

describe('NotChatComponent', () => {
  let component: NotChatComponent;
  let fixture: ComponentFixture<NotChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotChatComponent]
    });
    fixture = TestBed.createComponent(NotChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
