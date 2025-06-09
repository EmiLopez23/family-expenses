"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExpenseSchema, Currency } from "@/lib/schema";
import { TagSelector, type Tag } from "./tag-selector";
import { GroupSelector, type Group } from "./group-selector";
import { createExpenseAction } from "../../../actions/create/expense";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import ErrorMessage from "@/components/ui/error-message";

interface Props {
  currencies: Currency[];
  tags: Tag[];
  groups: Group[];
}

const expenseFormSchema = createExpenseSchema.omit({
  created_by: true,
  parent_id: true,
});

type ExpenseFormSchema = z.infer<typeof expenseFormSchema>;

export default function ExpenseForm({ currencies, tags, groups }: Props) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    groups.map((group) => group.id)
  );

  const form = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date().toISOString(),
      currency_id: currencies[0]?.id || "",
    },
  });

  const onSubmit = async (data: ExpenseFormSchema) => {
    try {
      const formData = new FormData();
      formData.append("amount", data.amount.toString());
      formData.append("description", data.description);
      formData.append("currency_id", data.currency_id);
      formData.append("date", data.date);

      await createExpenseAction(
        formData,
        selectedGroups,
        selectedTags.map((tag) => tag.id)
      );
    } catch (error) {
      if (error instanceof Error) {
        form.setError("root", { message: error.message });
      }
      console.error(error);
    }
  };

  const { errors } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        {/* Date Selection */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={(date) =>
                      date && field.onChange(date.toISOString())
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currency and Amount */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          <FormField
            control={form.control}
            name="currency_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Moneda</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="currency_id" className="w-full">
                      <SelectValue placeholder="Select currency">
                        {
                          currencies.find(
                            (currency) => currency.id === field.value
                          )?.code
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = parseFloat(value);
                      if (!isNaN(numericValue)) {
                        field.onChange(numericValue);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter expense description"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Selection */}
        <div>
          <Label>Tags</Label>
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            availableTags={tags}
          />
        </div>

        {/* Groups Selection */}
        <GroupSelector
          availableGroups={groups}
          selectedGroups={selectedGroups}
          onSelectChange={setSelectedGroups}
        />

        {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save Expense
        </Button>
      </form>
    </Form>
  );
}
